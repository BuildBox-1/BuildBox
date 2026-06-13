import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import QRCodeStyling from 'qr-code-styling';
import type { Options } from 'qr-code-styling';

type DataTab = 'url' | 'text' | 'wifi';

const TABS: { id: DataTab; label: string; placeholder: string }[] = [
    { id: 'url', label: 'URL', placeholder: 'https://example.com' },
    { id: 'text', label: 'Text', placeholder: 'Enter any text here…' },
    { id: 'wifi', label: 'WiFi', placeholder: 'WIFI:T:WPA;S:MyNetwork;P:pass123;;' },
];

const defaultOptions: Options = {
    width: 300,
    height: 300,
    type: 'svg',
    imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 10 },
    dotsOptions: { color: '#000000', type: 'rounded' },
    backgroundOptions: { color: 'transparent' },
    cornersSquareOptions: { color: '#000000', type: 'extra-rounded' },
};

export default function Flashyfury() {
    const [activeTab, setActiveTab] = useState<DataTab>('url');
    const [text, setText] = useState('https://buildbox.dev');
    const [copied, setCopied] = useState(false);
    
    const qrRef = useRef<HTMLDivElement>(null);
    const [qrCode] = useState(() => new QRCodeStyling(defaultOptions));

    useEffect(() => {
        if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrCode.append(qrRef.current);
        }
    }, [qrCode]);

    const generate = () => {
        if (!text.trim()) return;
        qrCode.update({ data: text.trim() });
    };

    const handleTabChange = (tabId: DataTab) => {
        setActiveTab(tabId);
        const tab = TABS.find(t => t.id === tabId);
        if (tab) setText(tab.placeholder);
    };

    return (
        <div className="flex flex-col flex-1 px-6 py-10 max-w-lg mx-auto w-full">
            <Link
                to="/projects/qr-code-generator"
                className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-8"
            >
                ← Back
            </Link>

            <h1 className="text-2xl font-bold text-(--text-h) tracking-tight mb-1">🔳 QR Code Generator</h1>
            <p className="font-mono text-xs text-(--text) mb-6">
                Powered by{' '}
                <a href="https://github.com/kozakdenys/qr-code-styling" target="_blank" rel="noreferrer" className="text-(--accent) hover:underline">
                    qr-code-styling
                </a>{' '}
                — simple, no-nonsense QR codes
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`font-mono text-xs px-4 py-2 rounded-lg transition-colors ${
                            activeTab === tab.id
                                ? 'bg-(--accent) text-white'
                                : 'bg-(--code-bg) border border-(--border) text-(--text) hover:text-(--text-h)'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generate()}
                    placeholder={TABS.find(t => t.id === activeTab)?.placeholder}
                    className="flex-1 font-mono text-sm bg-(--code-bg) border border-(--border) rounded-lg px-4 py-2.5 text-(--text-h) placeholder:text-(--text) outline-none focus:border-(--accent) transition-colors"
                />
                <button
                    onClick={generate}
                    className="font-mono text-sm bg-(--accent) text-white px-4 py-2.5 rounded-lg hover:opacity-85 transition-opacity shrink-0"
                >
                    Generate
                </button>
            </div>

            {/* Result */}
            <div className="flex flex-col gap-3">
                <div className="bg-(--code-bg) border border-(--accent-border) rounded-2xl p-6 flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm w-full max-w-[300px] aspect-square flex items-center justify-center">
                        <div ref={qrRef} className="w-full h-full [&>svg]:w-full [&>svg]:h-full" />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => qrCode.download({ extension: 'png', name: 'qr-code' })}
                        className="flex-1 font-mono text-sm bg-(--accent) text-white px-4 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
                    >
                        ↓ Download QR
                    </button>
                    <button
                        onClick={async () => {
                            const blob = await qrCode.getRawData('png');
                            if (blob) {
                                await navigator.clipboard.write([
                                    new ClipboardItem({ 'image/png': blob }),
                                ]);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }
                        }}
                        className="flex-1 font-mono text-sm bg-(--code-bg) border border-(--border) text-(--text-h) px-4 py-2.5 rounded-lg hover:text-(--accent) hover:border-(--accent) transition-colors"
                    >
                        {copied ? '✓ Copied!' : '⎘ Copy QR'}
                    </button>
                </div>
            </div>
        </div>
    );
}
