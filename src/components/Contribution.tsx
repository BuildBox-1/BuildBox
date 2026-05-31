import React from "react";

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

const HowToContribute: React.FC = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>How to Contribute</h1>
            <p style={styles.subtitle}>
                Follow these steps to contribute to the project.
            </p>

            <div style={styles.stepsContainer}>
                {steps.map((step, index) => (
                    <div key={index} style={styles.card}>
                        <h2 style={styles.stepTitle}>{step.title}</h2>
                        <p>{step.description}</p>
                        {step.code && (
                            <pre style={styles.codeBlock}>
                                <code>{step.code}</code>
                            </pre>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    heading: {
        textAlign: "center",
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
    },
    stepsContainer: {
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    card: {
        border: "1px solid #cab2b2",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#000000",
    },
    stepTitle: {
        marginBottom: "8px",
    },
    codeBlock: {
        backgroundColor: "#222",
        color: "#0f0",
        padding: "10px",
        borderRadius: "6px",
        marginTop: "8px",
        overflowX: "auto",
    },
};

export default HowToContribute;