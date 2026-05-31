const steps = [
    { num: '01', title: 'Branch', desc: 'Create a branch using your name' },
    { num: '02', title: 'Pick', desc: 'Choose a project or suggest one' },
    { num: '03', title: 'Build', desc: 'Code it in your branch' },
    { num: '04', title: 'Push', desc: 'Commit and push your changes' },
    { num: '05', title: 'PR', desc: 'Open a pull request for review' },
]

export default function FlowStrip() {
    return (
        <section id="contribute" className="px-6 py-10 border-b border-(--border)">
            <p className="font-mono text-[11px] text-(--text) uppercase tracking-widest mb-6">
                Contribution flow
            </p>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-0">
                {steps.map((step, i) => (
                    <div key={step.num} className="flex-1 relative sm:pl-4 first:pl-0">
                        {i > 0 && (
                            <span className="hidden sm:block absolute left-0 top-4 -translate-y-1/2 text-(--accent) font-mono text-sm">
                                →
                            </span>
                        )}
                        <div className="font-mono text-[11px] text-(--accent) font-medium mb-1">{step.num}</div>
                        <div className="text-sm font-semibold text-(--text-h) mb-1">{step.title}</div>
                        <div className="font-mono text-xs font-light text-(--text) leading-relaxed">{step.desc}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}