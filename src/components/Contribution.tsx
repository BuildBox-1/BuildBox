const steps = [
    {
        title: "Fork the repository",
        description:
            "Create your own copy of the repository to work independently without affecting the original project.",
    },
    {
        title: "Clone and set up the project",
        description:
            "Clone your fork locally and install dependencies. Ensure the project runs successfully before making changes.",
        code: `git clone https://github.com/rajbodhak/BuildBox.git
cd BuildBox
npm install
npm run dev`,
    },
    {
        title: "Create a focused branch",
        description:
            "Create a new branch for a single feature or fix. Avoid mixing multiple changes in one branch.",
        code: "git checkout -b feat/short-description",
    },
    {
        title: "Understand the codebase",
        description:
            "Read relevant files, follow existing patterns, and identify where your changes belong before writing code.",
    },
    {
        title: "Implement your changes",
        description:
            "Write clean, maintainable code. Follow naming conventions, file structure, and project guidelines.",
    },
    {
        title: "Test your changes",
        description:
            "Verify your changes work as expected and do not break existing functionality.",
    },
    {
        title: "Commit with clear messages",
        description:
            "Use meaningful, structured commit messages that explain what and why.",
        code: 'git commit -m "feat: add project filtering feature"',
    },
    {
        title: "Keep your branch updated",
        description:
            "Sync with the main repository to avoid merge conflicts before opening a PR.",
        code: `git fetch upstream
git rebase upstream/main`,
    },
    {
        title: "Push and open a pull request",
        description:
            "Push your branch and create a pull request with a clear title and description of your changes.",
        code: "git push origin feat/short-description",
    },
    {
        title: "Respond to review feedback",
        description:
            "Make requested changes promptly and engage constructively in the review process.",
    },
    {
        title: "Ensure quality before merge",
        description:
            "Confirm your code passes checks, follows standards, and is production-ready.",
    },
];

const HowToContribute = () => {
    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-(--text) overflow-hidden">

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-(--text-h)">
                How to Contribute
            </h1>

            <p className="text-center text-xs sm:text-sm mt-2 mb-8 break-words">
                Follow these steps to contribute to the project.
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-4 sm:gap-5">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="w-full border border-(--border) rounded-lg p-4 sm:p-5 bg-(--code-bg) overflow-hidden"
                    >
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
                ))}
            </div>
        </div>
    );
};

export default HowToContribute;