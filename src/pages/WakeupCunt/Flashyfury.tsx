import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router'
import './Flashyfury.css'

interface Alarm { id: string; hour: number; minute: number; enabled: boolean; sound: number }
type Tab = 'alarm' | 'stopwatch' | 'timer'
interface ActiveSound { stop: () => void; setVolume: (v: number) => void }

const SOUND_NAMES = ['Gentle Chime', 'Classic Beep', 'Bright Ring']
const STORAGE_KEY = 'timely_alarms'
const pad = (n: number) => n.toString().padStart(2, '0')
const fmt12 = (h: number, m: number) => { const p = h >= 12 ? 'PM' : 'AM'; const d = h === 0 ? 12 : h > 12 ? h - 12 : h; return `${pad(d)}:${pad(m)} ${p}` }
const fmtDur = (s: number) => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
const fmtMs = (ms: number) => pad(Math.floor(ms / 10) % 100)
const loadAlarms = (): Alarm[] => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : [] } catch { return [] } }
const saveAlarms = (a: Alarm[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(a))
let sharedCtx: AudioContext | null = null
function getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!sharedCtx) { const C = window.AudioContext || (window as any).webkitAudioContext; if (C) sharedCtx = new C() }
    if (sharedCtx?.state === 'suspended') sharedCtx.resume().catch(() => {})
    return sharedCtx
}
function startSound(soundIndex: number, vol: number): ActiveSound {
    const ctx = getCtx()
    if (!ctx) return { stop: () => {}, setVolume: () => {} }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    const gain = ctx.createGain()
    gain.gain.value = Math.min(vol / 100, 1)
    gain.connect(ctx.destination)
    let alive = true, tids: any[] = [], iid: any = null, nodes: AudioNode[] = []
    const note = (freq: number, dur: number, type: OscillatorType = 'sine', delay = 0) => {
        if (!alive) return
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.type = type; o.frequency.value = freq
        g.gain.setValueAtTime(0, ctx.currentTime + delay)
        g.gain.linearRampToValueAtTime(1, ctx.currentTime + delay + 0.02)
        g.gain.setValueAtTime(1, ctx.currentTime + delay + dur - 0.05)
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + dur)
        o.connect(g); g.connect(gain)
        o.start(ctx.currentTime + delay); o.stop(ctx.currentTime + delay + dur)
        nodes.push(o, g)
    }
    const pattern = () => {
        if (!alive) return
        nodes = []
        if (soundIndex === 0) [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tids.push(setTimeout(() => note(f, 0.4), i * 250)))
        else if (soundIndex === 1) { note(880, 0.12, 'square'); note(880, 0.12, 'square', 0.2) }
        else for (let i = 0; i < 6; i++) note(i % 2 === 0 ? 987.77 : 1174.66, 0.06, 'triangle', i * 0.12)
    }
    pattern()
    iid = setInterval(pattern, soundIndex === 0 ? 1800 : 1000)
    return {
        stop: () => {
            alive = false; clearInterval(iid); tids.forEach(clearTimeout)
            nodes.forEach(n => { try { if (n instanceof OscillatorNode) n.stop(); n.disconnect() } catch {} })
            try { gain.disconnect() } catch {}
        },
        setVolume: (v: number) => { gain.gain.value = Math.min(v / 100, 1) }
    }
}
function TimelinePicker({ selectedHour, selectedMinute, onSelect }: { selectedHour: number; selectedMinute: number; onSelect: (h: number, m: number) => void }) {
    const ref = useRef<HTMLDivElement>(null); const W = 72
    useEffect(() => { if (ref.current) { const i = selectedHour * 12 + Math.floor(selectedMinute / 5); ref.current.scrollLeft = i * W - ref.current.clientWidth / 2 + W / 2 } }, []) // eslint-disable-line
    const slots = Array.from({ length: 288 }, (_, i) => ({ h: Math.floor(i / 12), m: (i % 12) * 5 }))
    return (
        <div ref={ref} className="timeline-scroll hide-scrollbar">
            <div style={{ display: 'inline-flex', gap: 4, padding: '0 calc(50% - 36px)' }}>
                {slots.map(({ h, m }) => {
                    const sel = h === selectedHour && m === selectedMinute
                    return <button key={`${h}-${m}`} className={`tslot${sel ? ' tslot-active' : m === 0 ? ' tslot-hour' : ''}`} onClick={() => { onSelect(h, m); if (ref.current) { const i = h * 12 + Math.floor(m / 5); ref.current.scrollTo({ left: i * W - ref.current.clientWidth / 2 + W / 2, behavior: 'smooth' }) } }}>{pad(h)}:{pad(m)}</button>
                })}
            </div>
        </div>
    )
}

const SHAPES = [
    { name: 'Z', points: [{ x: 20, y: 20 }, { x: 80, y: 20 }, { x: 20, y: 80 }, { x: 80, y: 80 }], path: "M 20 20 L 80 20 L 20 80 L 80 80" },
    { name: 'Circle', points: [{ x: 50, y: 15 }, { x: 85, y: 50 }, { x: 50, y: 85 }, { x: 15, y: 50 }, { x: 50, y: 15 }], path: "M 50 15 A 35 35 0 1 1 49.9 15 Z" },
    { name: 'Lightning Bolt', points: [{ x: 75, y: 15 }, { x: 35, y: 55 }, { x: 65, y: 55 }, { x: 25, y: 85 }], path: "M 75 15 L 35 55 L 65 55 L 25 85" },
    { name: 'Triangle', points: [{ x: 50, y: 15 }, { x: 85, y: 80 }, { x: 15, y: 80 }, { x: 50, y: 15 }], path: "M 50 15 L 85 80 L 15 80 Z" }
]
const CHALLENGES = ['math', 'draw', 'memory', 'shake', 'color'] as const
type ChallengeType = typeof CHALLENGES[number]
const selectRandomChallenge = (exclude?: ChallengeType): ChallengeType => {
    const available = CHALLENGES.filter(c => c !== exclude)
    return available[Math.floor(Math.random() * available.length)]
}
function AlarmOverlay({ alarm, onDismiss }: { alarm: Alarm; onDismiss: () => void }) {
    const [now, setNow] = useState(new Date()), [vol, setVol] = useState(20)
    const [chType, setChType] = useState<ChallengeType>(() => selectRandomChallenge())
    const [mathData, setMathData] = useState<{ q: string; ans: number }[]>([])
    const [mathAnswers, setMathAnswers] = useState<string[]>(['', '', ''])
    const [drawShape, setDrawShape] = useState<typeof SHAPES[number] | null>(null)
    const [drawIndex, setDrawIndex] = useState(0), [isDrawing, setIsDrawing] = useState(false)
    const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
    const [memNum, setMemNum] = useState(''), [memStage, setMemStage] = useState<'show' | 'input'>('show'), [memInput, setMemInput] = useState('')
    const [shakeCount, setShakeCount] = useState(0), [shakeBounce, setShakeBounce] = useState(false)
    const [colorsOrder, setColorsOrder] = useState<number[]>([]), [colorColors, setColorColors] = useState<{ name: string; color: string; id: number }[]>([])
    const [colorProgress, setColorProgress] = useState(0), [colorGlow, setColorGlow] = useState<number[]>([])
    const [timerVal, setTimerVal] = useState(10.0), [solved, setSolved] = useState(false), [wrong, setWrong] = useState(false)
    const [confetti, setConfetti] = useState<{ id: number; color: string; left: string; delay: string; dur: string }[]>([])
    const snd = useRef<ActiveSound | null>(null), vi = useRef<number | null>(null)

    useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])

    useEffect(() => {
        snd.current = startSound(alarm.sound, 20)
        vi.current = window.setInterval(() => setVol(p => { const n = Math.min(p + 10, 100); snd.current?.setVolume(n); return n }), 1000)
        return () => { if (vi.current) clearInterval(vi.current); snd.current?.stop() }
    }, []) // eslint-disable-line

    const playNote = (freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.3) => {
        const ctx = getCtx(); if (!ctx) return
        const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain()
        o.type = type; o.frequency.setValueAtTime(freq, t); o.connect(g); g.connect(ctx.destination)
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.05); g.gain.linearRampToValueAtTime(0, t + dur)
        o.start(t); o.stop(t + dur)
    }
    const playSuccessSound = () => {
        const ctx = getCtx(); if (!ctx) return; const t = ctx.currentTime
        const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination)
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3, t + 0.05); g.gain.linearRampToValueAtTime(0, t + 0.4)
        ;[523.25, 659.25, 783.99, 1046.50].forEach((f, i) => o.frequency.setValueAtTime(f, t + i * 0.08))
        o.start(t); o.stop(t + 0.4)
    }
    const playBuzzSound = () => playNote(120, 0.3, 'sawtooth')
    const playTunedNote = (i: number) => playNote([523.25, 587.33, 659.25, 698.46, 783.99][i % 5], 0.15)


    const setupChallenge = (type: ChallengeType) => {
        setWrong(false)
        if (type === 'math') {
            const ops = [
                { q: `${~~(Math.random()*40)+10} + ${~~(Math.random()*40)+10}`, op: '+' },
                { q: `${~~(Math.random()*7)+3} × ${~~(Math.random()*9)+3}`, op: '×' },
                { q: `${~~(Math.random()*50)+50} - ${~~(Math.random()*40)+10}`, op: '-' }
            ]
            const data = ops.map(({ q, op }) => { const [a, b] = q.split(/[+×\-]/).map(x => +x.trim()); return { q, ans: op==='+' ? a+b : op==='×' ? a*b : a-b } })
            setMathData(data); setMathAnswers(['', '', '']); setTimerVal(10.0)
        } else if (type === 'draw') {
            setDrawShape(SHAPES[~~(Math.random()*SHAPES.length)]); setDrawIndex(0); setIsDrawing(false); setDragPos(null)
        } else if (type === 'memory') {
            setMemNum((~~(Math.random()*900)+100).toString()); setMemStage('show'); setMemInput(''); setTimerVal(2.0)
        } else if (type === 'shake') {
            setShakeCount(0); setShakeBounce(false); setTimerVal(5.0)
        } else {
            const BASE = [{name:'Red',color:'#ef4444',id:0},{name:'Blue',color:'#3b82f6',id:1},{name:'Green',color:'#10b981',id:2},{name:'Yellow',color:'#f59e0b',id:3},{name:'Purple',color:'#8b5cf6',id:4}]
            setColorsOrder([0,1,2,3,4].sort(() => Math.random()-.5))
            setColorColors([...BASE].sort(() => Math.random()-.5))
            setColorProgress(0); setColorGlow([])
        }
    }

    useEffect(() => { setupChallenge(chType) }, [chType]) // eslint-disable-line
    useEffect(() => {
        if (solved) return
        if (chType === 'math' || (chType === 'memory' && memStage === 'show') || chType === 'shake') {
            const timer = setInterval(() => setTimerVal(prev => {
                const next = Math.max(0, Math.round((prev - 0.1) * 10) / 10)
                if (next <= 0) {
                    clearInterval(timer)
                    if (chType === 'memory' && memStage === 'show') setMemStage('input')
                    else { playBuzzSound(); setWrong(true); setTimeout(() => setupChallenge(chType), 800) }
                }
                return next
            }), 100)
            return () => clearInterval(timer)
        }
    }, [chType, memStage, solved]) // eslint-disable-line

    const handleSuccess = () => {
        setSolved(true); playSuccessSound(); snd.current?.stop(); snd.current = null
        if (vi.current) { clearInterval(vi.current); vi.current = null }
        const C = ['#f43f5e','#3b82f6','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4']
        setConfetti(Array.from({length:60},(_,i)=>({id:i,color:C[~~(Math.random()*C.length)],left:`${Math.random()*100}%`,delay:`${Math.random()*2}s`,dur:`${2+Math.random()*3}s`})))
    }

    const checkMathAnswers = () => {
        if (mathData.every((item, idx) => parseInt(mathAnswers[idx], 10) === item.ans)) { handleSuccess() }
        else { playBuzzSound(); setWrong(true); setTimeout(() => setWrong(false), 800) }
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!drawShape) return
        e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId)
        const rect = e.currentTarget.getBoundingClientRect()
        const px = ((e.clientX - rect.left) / rect.width) * 100
        const py = ((e.clientY - rect.top) / rect.height) * 100
        if (Math.hypot(px - drawShape.points[0].x, py - drawShape.points[0].y) < 15) { setIsDrawing(true); setDrawIndex(1) }
    }
    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDrawing || !drawShape) return
        const rect = e.currentTarget.getBoundingClientRect()
        const px = ((e.clientX - rect.left) / rect.width) * 100, py = ((e.clientY - rect.top) / rect.height) * 100
        setDragPos({ x: px, y: py })
        if (Math.hypot(px - drawShape.points[drawIndex].x, py - drawShape.points[drawIndex].y) < 15) {
            if (drawIndex + 1 >= drawShape.points.length) { setIsDrawing(false); handleSuccess() }
            else setDrawIndex(drawIndex + 1)
        }
    }
    const handlePointerUp = () => { setIsDrawing(false); setDrawIndex(0); setDragPos(null) }

    const handleKeypadPress = (val: string) => {
        if (val === 'C') setMemInput('')
        else if (val === '⌫') setMemInput(p => p.slice(0, -1))
        else if (val === '↵') {
            if (memInput === memNum) handleSuccess()
            else { playBuzzSound(); setWrong(true); setTimeout(() => { setWrong(false); setupChallenge('memory') }, 800) }
        } else if (memInput.length < 3) setMemInput(p => p + val)
    }

    const handleColorTap = (id: number) => {
        if (id === colorsOrder[colorProgress]) {
            playTunedNote(colorProgress); setColorGlow(p => [...p, id])
            const next = colorProgress + 1; setColorProgress(next)
            if (next === 5) handleSuccess()
        } else { playBuzzSound(); setWrong(true); setColorProgress(0); setColorGlow([]); setTimeout(() => setWrong(false), 800) }
    }

    const handleGiveUp = () => setChType(selectRandomChallenge(chType))
    const getChallengeTitle = () => ['math','draw','memory','shake','color'].includes(chType)
        ? `Challenge: ${{math:'Math Rush',draw:'Pattern Draw',memory:'Memory Number',shake:'Shake Button',color:'Color Order'}[chType]}!`
        : 'Challenge!'

    const renderChallenge = () => {
        if (chType === 'math') {
            return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)' }}>Solve all 3 within 10s:</span>
                        <span style={{ fontSize: 18, color: timerVal < 4.0 ? '#ef4444' : 'var(--accent)', fontWeight: 700, fontFamily: 'var(--mono)' }}>{timerVal.toFixed(1)}s</span>
                    </div>
                    <div className="timer-bar-container">
                        <div className="timer-bar" style={{ width: `${(timerVal / 10.0) * 100}%` }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {mathData.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 22, fontFamily: 'var(--mono)', color: '#fff', fontWeight: 600 }}>{item.q}</span>
                                <input type="number" pattern="[0-9]*" value={mathAnswers[idx]} onChange={e => { const u = [...mathAnswers]; u[idx] = e.target.value; setMathAnswers(u) }} className="math-input" placeholder="?" />
                            </div>
                        ))}
                    </div>
                    <button className="dismiss-btn" style={{ width: '100%' }} onClick={checkMathAnswers}>Verify</button>
                </div>
            )
        }
        if (chType === 'draw') {
            return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)', textAlign: 'center' }}>Trace the {drawShape?.name} pattern in one stroke!</div>
                    <div className="draw-area" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} style={{ touchAction: 'none' }}>
                        {drawShape && (
                            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                                <path d={drawShape.path} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" strokeDasharray="5 5" className="fade-guide" />
                                {isDrawing && dragPos && drawIndex > 0 && <line x1={drawShape.points[drawIndex - 1].x} y1={drawShape.points[drawIndex - 1].y} x2={dragPos.x} y2={dragPos.y} stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />}
                                {isDrawing && drawIndex > 1 && <path d={`M ${drawShape.points.slice(0, drawIndex).map(p => `${p.x} ${p.y}`).join(' L ')}`} fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />}
                                {drawShape.points.map((p, idx) => {
                                    const fill = idx < drawIndex ? '#10b981' : idx === drawIndex ? 'var(--accent)' : 'rgba(255,255,255,0.3)'
                                    const size = idx < drawIndex ? 7 : idx === drawIndex ? 9 : 6
                                    const stroke = idx === drawIndex ? '#fff' : 'none'
                                    return <circle key={idx} cx={p.x} cy={p.y} r={size} fill={fill} stroke={stroke} strokeWidth="1.5" className={idx === drawIndex ? 'pulse-dot' : ''} />
                                })}
                            </svg>
                        )}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)' }}>{isDrawing ? 'Tracing...' : 'Press & drag starting at the glowing dot'}</div>
                </div>
            )
        }
        if (chType === 'memory') {
            return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                    {memStage === 'show' ? (
                        <>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)' }}>Memorize the number:</div>
                            <div style={{ fontSize: 64, fontWeight: 800, color: '#fff', letterSpacing: 4, fontFamily: 'var(--mono)', margin: '10px 0' }}>{memNum}</div>
                            <div className="timer-bar-container" style={{ width: '120px' }}><div className="timer-bar" style={{ width: `${(timerVal / 2.0) * 100}%` }} /></div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)' }}>Enter the number:</div>
                            <div className="memory-input-display">
                                {Array.from({ length: 3 }).map((_, i) => <span key={i} style={{ margin: '0 8px', borderBottom: '2px solid rgba(255,255,255,0.3)', width: 24, textAlign: 'center', color: memInput[i] ? '#fff' : 'rgba(255,255,255,0.15)' }}>{memInput[i] || '•'}</span>)}
                            </div>
                            <div className="keypad">
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(k => <button key={k} className="keypad-btn" onClick={() => handleKeypadPress(k)}>{k}</button>)}
                            </div>
                            <button className="dismiss-btn" style={{ width: '100%', marginTop: 8 }} onClick={() => handleKeypadPress('↵')} disabled={memInput.length !== 3}>↵ Submit</button>
                        </>
                    )}
                </div>
            )
        }
        if (chType === 'shake') {
            return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)' }}>Tap 3 times fast!</span>
                        <span style={{ fontSize: 18, color: timerVal < 2.0 ? '#ef4444' : 'var(--accent)', fontWeight: 700, fontFamily: 'var(--mono)' }}>{timerVal.toFixed(1)}s</span>
                    </div>
                    <div className="timer-bar-container"><div className="timer-bar" style={{ width: `${(timerVal / 5.0) * 100}%` }} /></div>
                    <button className={`shake-trigger-btn${shakeBounce ? ' shake-bounce-anim' : ''}`} onClick={() => { setShakeBounce(true); setTimeout(() => setShakeBounce(false), 200); setShakeCount(c => { const n = c + 1; if (n >= 3) handleSuccess(); return n }) }}>⚡️ {shakeCount} / 3</button>
                </div>
            )
        }
        const targetColorNames = colorsOrder.map(idx => ['Red', 'Blue', 'Green', 'Yellow', 'Purple'][idx])
        return (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)', textAlign: 'center' }}>Tap in order:</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'var(--mono)', textAlign: 'center', background: 'rgba(255,255,255,0.06)', padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
                    {targetColorNames.map((name, idx) => <span key={idx} style={{ color: idx < colorProgress ? 'rgba(255,255,255,0.3)' : '#fff', textDecoration: idx < colorProgress ? 'line-through' : 'none' }}>{name}{idx < targetColorNames.length - 1 && ' ➔ '}</span>)}
                </div>
                <div className="colors-row">
                    {colorColors.map(c => <button key={c.id} className={`color-circle${colorGlow.includes(c.id) ? ' color-circle-glow' : ''}`} style={{ backgroundColor: c.color, '--c': c.color } as React.CSSProperties} onClick={() => handleColorTap(c.id)} aria-label={c.name} />)}
                </div>
            </div>
        )
    }

    return (
        <div className="overlay">
            {solved && (
                <div className="confetti-container">
                    {confetti.map(p => <div key={p.id} className="confetti-p" style={{ '--c': p.color, '--delay': p.delay, '--d': p.dur, left: p.left } as React.CSSProperties} />)}
                </div>
            )}
            <div className="overlay-vol">🔊 {vol}%</div>
            <div className="overlay-time">{pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}</div>
            <div className="overlay-label">⏰ Alarm: {fmt12(alarm.hour, alarm.minute)}</div>
            
            {!solved ? (
                <div className={`challenge-box${wrong ? ' challenge-wrong' : ''}`} style={{ width: '100%', maxWidth: '320px', transition: 'all 0.3s' }}>
                    <div className="challenge-title">{getChallengeTitle()}</div>
                    {renderChallenge()}
                    {wrong && <div style={{ color: '#ef4444', fontSize: 13, fontFamily: 'var(--mono)', textAlign: 'center', animation: 'bounceIn 0.3s' }}>✗ Incorrect! Try again!</div>}
                    <button className="give-up-btn" onClick={handleGiveUp}>Give Up (Skip Challenge)</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 20 }}>
                    <div style={{ fontSize: 48, animation: 'bounceIn 0.5s ease' }}>🎉</div>
                    <div style={{ color: '#4ade80', fontSize: 18, fontWeight: 600, fontFamily: 'var(--mono)' }}>Correct! You're awake!</div>
                    <button className="dismiss-btn" onClick={onDismiss}>Dismiss Alarm</button>
                </div>
            )}
        </div>
    )
}

function Stopwatch() {
    const [running, setRunning] = useState(false), [elapsed, setElapsed] = useState(0), [laps, setLaps] = useState<number[]>([])
    const t0 = useRef(0), raf = useRef(0)
    const tick = useCallback(() => { setElapsed(Date.now() - t0.current); raf.current = requestAnimationFrame(tick) }, [])
    const start = () => { t0.current = Date.now() - elapsed; setRunning(true); raf.current = requestAnimationFrame(tick) }
    const stop = () => { setRunning(false); cancelAnimationFrame(raf.current) }
    const reset = () => { stop(); setElapsed(0); setLaps([]) }
    useEffect(() => () => cancelAnimationFrame(raf.current), [])
    return (
        <div className="tab-center">
            <div className="big-display">{fmtDur(Math.floor(elapsed / 1000))}<span style={{ fontSize: '0.5em', color: 'var(--accent)' }}>.{fmtMs(elapsed)}</span></div>
            <div style={{ display: 'flex', gap: 12 }}>
                {!running ? <button className="sw-btn sw-btn-primary" onClick={start}>{elapsed > 0 ? 'Resume' : 'Start'}</button> : <button className="sw-btn sw-btn-danger" onClick={stop}>Stop</button>}
                {running && <button className="sw-btn sw-btn-secondary" onClick={() => setLaps(p => [elapsed, ...p])}>Lap</button>}
                {!running && elapsed > 0 && <button className="sw-btn sw-btn-secondary" onClick={reset}>Reset</button>}
            </div>
            {laps.length > 0 && <div style={{ width: '100%', maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {laps.map((ms, i) => <div key={i} className="lap-row"><span>Lap {laps.length - i}</span><span style={{ color: 'var(--text-h)' }}>{fmtDur(Math.floor(ms / 1000))}.{fmtMs(ms)}</span></div>)}
            </div>}
        </div>
    )
}

function CountdownTimer() {
    const [H, setH] = useState(0), [M, setM] = useState(5), [S, setS] = useState(0), [remaining, setRemaining] = useState(0)
    const [running, setRunning] = useState(false), [done, setDone] = useState(false), iref = useRef(0)
    const start = () => {
        if (running || done) return
        const total = remaining > 0 ? remaining : H * 3600 + M * 60 + S; if (!total) return
        setRemaining(total); setRunning(true)
        const end = Date.now() + total * 1000
        iref.current = window.setInterval(() => {
            const left = Math.max(0, Math.ceil((end - Date.now()) / 1000))
            setRemaining(left)
            if (!left) { clearInterval(iref.current); setRunning(false); setDone(true); const s = startSound(0, 80); setTimeout(() => s.stop(), 2500) }
        }, 100)
    }
    const pause = () => { setRunning(false); clearInterval(iref.current) }
    const reset = () => { pause(); setRemaining(0); setDone(false) }
    useEffect(() => () => clearInterval(iref.current), [])
    const display = running || remaining > 0 ? remaining : H * 3600 + M * 60 + S
    const fields = [{ label: 'H', val: H, set: setH, max: 23 }, { label: 'M', val: M, set: setM, max: 59 }, { label: 'S', val: S, set: setS, max: 59 }]
    return (
        <div className="tab-center">
            {!running && !remaining && <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {fields.map(({ label, val, set, max }) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <button className="timer-adj-btn" onClick={() => set(v => Math.min(v + 1, max))}>▲</button>
                        <input type="text" inputMode="numeric" value={pad(val)} className="timer-input" onChange={e => { const v = parseInt(e.target.value.replace(/\D/g, ''), 10); set(isNaN(v) ? 0 : Math.min(Math.max(v, 0), max)) }} />
                        <button className="timer-adj-btn" onClick={() => set(v => Math.max(v - 1, 0))}>▼</button>
                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text)', textTransform: 'uppercase' }}>{label}</span>
                    </div>
                ))}
            </div>}
            <div className="big-display" style={{ color: done ? '#4ade80' : 'var(--text-h)' }}>{fmtDur(display)}</div>
            {done && <div style={{ fontSize: 14, color: '#4ade80', fontFamily: 'var(--mono)' }}>🎉 Time's up!</div>}
            <div style={{ display: 'flex', gap: 12 }}>
                {!running ? <button className="sw-btn sw-btn-primary" onClick={start} disabled={done}>{remaining > 0 ? 'Resume' : 'Start'}</button> : <button className="sw-btn sw-btn-danger" onClick={pause}>Pause</button>}
                {(remaining > 0 || done) && <button className="sw-btn sw-btn-secondary" onClick={reset}>Reset</button>}
            </div>
        </div>
    )
}

export default function Flashyfury() {
    const [tab, setTab] = useState<Tab>('alarm'), [alarms, setAlarms] = useState<Alarm[]>(loadAlarms)
    const [selH, setSelH] = useState(() => new Date().getHours()), [selM, setSelM] = useState(() => Math.ceil(new Date().getMinutes() / 5) * 5 % 60)
    const [selSnd, setSelSnd] = useState(0), [triggered, setTriggered] = useState<Alarm | null>(null), [now, setNow] = useState(new Date())
    const [previewing, setPreviewing] = useState<number | null>(null), previewRef = useRef<ActiveSound | null>(null)
    useEffect(() => {
        const w = () => getCtx(); window.addEventListener('click', w); window.addEventListener('touchstart', w); window.addEventListener('keydown', w)
        return () => { window.removeEventListener('click', w); window.removeEventListener('touchstart', w); window.removeEventListener('keydown', w); previewRef.current?.stop() }
    }, [])
    useEffect(() => { saveAlarms(alarms) }, [alarms])
    useEffect(() => {
        const t = setInterval(() => {
            const n = new Date(); setNow(n)
            if (!triggered && n.getSeconds() === 0) { const a = alarms.find(x => x.enabled && x.hour === n.getHours() && x.minute === n.getMinutes()); if (a) setTriggered(a) }
        }, 1000); return () => clearInterval(t)
    }, [alarms, triggered])
    const addAlarm = () => setAlarms(p => [...p, { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), hour: selH, minute: selM, enabled: true, sound: selSnd }].sort((a, b) => a.hour * 60 + a.minute - b.hour * 60 - b.minute))
    const toggleAlarm = (id: string) => setAlarms(p => p.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))
    const deleteAlarm = (id: string) => setAlarms(p => p.filter(a => a.id !== id))
    const togglePreview = () => {
        if (previewing !== null) { previewRef.current?.stop(); previewRef.current = null; setPreviewing(null) }
        else {
            const s = startSound(selSnd, 80); previewRef.current = s; setPreviewing(selSnd)
            setTimeout(() => { if (previewRef.current === s) { s.stop(); previewRef.current = null; setPreviewing(null) } }, 2500)
        }
    }
    return (
        <>

            {triggered && <AlarmOverlay alarm={triggered} onDismiss={() => setTriggered(null)} />}
            <div className="flex flex-col flex-1 px-6 py-10 max-w-lg mx-auto w-full">
                <Link to="/projects/wake-up-cunt" className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-8">← Back</Link>
                <h1 className="text-2xl font-bold text-(--text-h) tracking-tight mb-1">⏰ Wake-up Cunt!</h1>
                <p className="font-mono text-xs text-(--text) mb-2">Built by Flashyfury — wake up on time, every time</p>
                <div className="live-clock">
                    {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} •{' '}
                    <span style={{ color: 'var(--text-h)', fontWeight: 600 }}>{pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}</span>
                </div>
                <div className="tab-bar">
                    {[{ id: 'alarm' as Tab, label: 'Alarm', icon: '⏰' }, { id: 'stopwatch' as Tab, label: 'Stopwatch', icon: '⏱' }, { id: 'timer' as Tab, label: 'Timer', icon: '⏳' }].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn${tab === t.id ? ' tab-active' : ''}`}>{t.icon} {t.label}</button>
                    ))}
                </div>
                {tab === 'alarm' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="time-display-box">
                            <input type="time" value={`${pad(selH)}:${pad(selM)}`} className="time-input" onChange={e => { if (e.target.value) { const [h, m] = e.target.value.split(':').map(Number); setSelH(h); setSelM(m) } }} />
                            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text)', marginTop: 4 }}>Tap to type or drag timeline below</div>
                        </div>
                        <div style={{ borderRadius: 16, background: 'var(--code-bg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                            <TimelinePicker selectedHour={selH} selectedMinute={selM} onSelect={(h, m) => { setSelH(h); setSelM(m) }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <select value={selSnd} className="snd-select" onChange={e => { setSelSnd(+e.target.value); previewRef.current?.stop(); previewRef.current = null; setPreviewing(null) }}>
                                {SOUND_NAMES.map((n, i) => <option key={i} value={i}>🔔 {n}</option>)}
                            </select>
                            <button onClick={togglePreview} className={`test-btn${previewing !== null ? ' test-btn-active' : ''}`}>{previewing !== null ? '⏹ Stop' : '▶ Test'}</button>
                            <button onClick={addAlarm} className="add-btn">+ Add Alarm</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <h2 className="section-label">Saved Alarms ({alarms.length})</h2>
                            {alarms.length === 0 ? <div className="empty-state">No alarms set. Use the timeline above to pick a time and add one!</div> : (
                                <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {alarms.map(a => (
                                        <div key={a.id} className={`alarm-card${a.enabled ? ' alarm-on' : ''}`}>
                                            <div style={{ flex: 1 }}>
                                                <div className="alarm-time" style={{ color: a.enabled ? 'var(--text-h)' : 'var(--text)' }}>{fmt12(a.hour, a.minute)}</div>
                                                <div className="alarm-sub">🔔 {SOUND_NAMES[a.sound]}</div>
                                            </div>
                                            <button className={`toggle-track ${a.enabled ? 'on' : 'off'}`} onClick={() => toggleAlarm(a.id)} aria-label="Toggle alarm"><div className="toggle-knob" /></button>
                                            <button className="del-btn" onClick={() => deleteAlarm(a.id)} onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }} aria-label="Delete alarm">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {tab === 'stopwatch' && <div className="tab-panel"><Stopwatch /></div>}
                {tab === 'timer' && <div className="tab-panel"><CountdownTimer /></div>}
            </div>
        </>
    )
}

