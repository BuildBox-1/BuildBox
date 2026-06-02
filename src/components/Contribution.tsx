const steps = [
    {
        title: "Fork & Clone the repository",
        description: "Create your own copy and set up the project locally.",
        code: `git clone https://github.com/your-username/BuildBox.git
cd BuildBox
npm install
npm run dev`,
    },
    {
        title: "Sync with main branch",
        description: "Always start from the latest code to avoid conflicts.",
        code: `git checkout main
git pull origin main`,
    },
    {
        title: "Create a feature branch",
        description: "Work on a separate branch for each feature or fix.",
        code: "git checkout -b feature/add-auth",
    },
    {
        title: "Make your changes",
        description: "Follow project structure and keep changes focused.",
    },
    {
        title: "Commit your changes",
        description: "Write clear and meaningful commit messages.",
        code: `git add .
git commit -m "feat: add auth system"`,
    },
    {
        title: "Push your branch",
        description: "Upload your branch to GitHub.",
        code: "git push origin feature/add-auth",
    },
    {
        title: "Open a Pull Request",
        description: "Create a PR to main with a clear title and description. Prefer squash merge.",
    },
    {
        title: "Update based on review",
        description: "Make changes if requested and push again.",
        code: `git add .
git commit -m "fix: review changes"
git push origin feature/add-auth`,
    },
    {
        title: "After merge: sync & cleanup",
        description: "Update local main and remove the feature branch.",
        code: `git checkout main
git pull origin main

git branch -D feature/add-auth
git push origin --delete feature/add-auth`,
    },
];

export default function HowToContribute() {
    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-(--text)">

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-(--text-h)">
                How to Contribute
            </h1>

            <p className="text-center text-xs sm:text-sm mt-2 mb-10">
                Follow this standard workflow to contribute efficiently.
            </p>

            <div className="relative border-l border-(--border) ml-3 sm:ml-4">

                {steps.map((step, index) => (
                    <div key={index} className="relative mb-8 pl-6 sm:pl-8">

                        <span className="absolute -left-[7px] sm:-left-[9px] top-1.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-(--accent) border border-(--bg)" />

                        <div className="bg-(--code-bg) border border-(--border) rounded-lg p-4 sm:p-5 overflow-hidden">

                            <h2 className="text-sm sm:text-base font-semibold text-(--accent) mb-1 break-words">
                                {index + 1}. {step.title}
                            </h2>

                            <p className="text-xs sm:text-sm leading-relaxed break-words">
                                {step.description}
                            </p>

                            {step.code && (
                                <pre className="mt-3 p-3 text-[11px] sm:text-xs bg-(--bg) border border-(--border) rounded-md overflow-x-auto whitespace-pre-wrap break-words">
                                    <code className="break-words">
                                        {step.code}
                                    </code>
                                </pre>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}