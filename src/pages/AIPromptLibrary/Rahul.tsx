import { useState } from "react";
import { Link } from "react-router";
const PROMPTS = [
  // ── Writing ──────────────────────────────────────────────────────────────
  { id: 1, cat: "Writing", title: "Blog Post", prompt: "Write a detailed, engaging blog post about [topic]. Include an introduction, 3-5 main sections with subheadings, and a conclusion. Use a conversational tone with real-world examples." },
  { id: 2, cat: "Writing", title: "Email Draft", prompt: "Write a professional email to [recipient] about [topic]. Keep it concise and polite. Include a subject line, greeting, body, and a clear call-to-action." },
  { id: 3, cat: "Writing", title: "LinkedIn Post", prompt: "Write a compelling LinkedIn post about [topic]. Make it personal and insightful, and end with a question to encourage engagement. Max 200 words." },
  { id: 4, cat: "Writing", title: "Cover Letter", prompt: "Write a cover letter for a [job title] position at [company]. Highlight my skills in [skills] and experience in [field]. Keep it to 3 short paragraphs." },
  { id: 5, cat: "Writing", title: "Product Description", prompt: "Write a persuasive product description for [product]. Focus on benefits over features, use sensory language, and end with a strong call-to-action." },
  { id: 6, cat: "Writing", title: "Press Release", prompt: "Write a press release announcing [news/event] for [company]. Include a headline, dateline, lead paragraph answering who/what/when/where/why, supporting quotes, and boilerplate." },
  { id: 7, cat: "Writing", title: "Newsletter", prompt: "Write a monthly newsletter for [brand/topic]. Include a warm intro, 3 sections covering [topics], a featured tip, and a closing CTA. Keep it friendly and scannable." },
  { id: 8, cat: "Writing", title: "Tweet Thread", prompt: "Write a 10-tweet thread about [topic]. Start with a hook tweet, build the argument or story across tweets 2-9, and end with a strong takeaway. Number each tweet." },
  { id: 9, cat: "Writing", title: "Case Study", prompt: "Write a case study about how [company/person] solved [problem] using [solution]. Structure: challenge, approach, results, key takeaways. Use specific numbers." },
  { id: 10, cat: "Writing", title: "Executive Summary", prompt: "Write a one-page executive summary for [document/project]. Include the purpose, key findings, recommendations, and next steps. Make it scannable for busy readers." },
  { id: 11, cat: "Writing", title: "Speech", prompt: "Write a [duration]-minute speech about [topic] for [audience]. Include an opening hook, 3 main points, supporting stories, and a memorable closing." },
  { id: 12, cat: "Writing", title: "FAQs", prompt: "Write 10 frequently asked questions and answers for [product/service/topic]. Address common concerns, keep answers under 100 words each, and use plain language." },
  { id: 13, cat: "Writing", title: "How-To Guide", prompt: "Write a step-by-step how-to guide for [task]. Include an intro explaining why this matters, numbered steps with clear actions, tips for common mistakes, and a summary." },
  { id: 14, cat: "Writing", title: "Apology Email", prompt: "Write a sincere apology email to [recipient] about [issue]. Acknowledge the problem, take responsibility, explain what happened, and outline what you're doing to fix it." },

  // ── Coding ───────────────────────────────────────────────────────────────
  { id: 15, cat: "Coding", title: "Code Review", prompt: "Review the following code and provide feedback on: 1) correctness, 2) performance, 3) readability, 4) potential bugs, 5) improvements. Code: [paste code]" },
  { id: 16, cat: "Coding", title: "Explain Code", prompt: "Explain the following code in simple terms. Break it down step by step, explain what it does, why it's written this way, and flag any issues. Code: [paste code]" },
  { id: 17, cat: "Coding", title: "Debug Help", prompt: "I'm getting this error: [error message]. My code is: [paste code]. What's causing this and how do I fix it? Also explain why this error occurs." },
  { id: 18, cat: "Coding", title: "Write Unit Tests", prompt: "Write comprehensive unit tests for the following function using [Jest/Vitest/etc]. Cover happy paths, edge cases, and error cases. Code: [paste code]" },
  { id: 19, cat: "Coding", title: "Refactor Code", prompt: "Refactor the following code to be cleaner, more readable, and more efficient while keeping the same functionality. Explain each change you made. Code: [paste code]" },
  { id: 20, cat: "Coding", title: "API Design", prompt: "Design a RESTful API for [feature/product]. Include endpoints, HTTP methods, request/response formats, status codes, and authentication approach. Follow REST best practices." },
  { id: 21, cat: "Coding", title: "Database Schema", prompt: "Design a database schema for [application]. Include tables, columns, data types, primary/foreign keys, and indexes. Explain the relationships and any design decisions." },
  { id: 22, cat: "Coding", title: "System Design", prompt: "Design a scalable system for [feature] that handles [scale]. Include architecture diagram description, key components, data flow, databases, caching, and trade-offs." },
  { id: 23, cat: "Coding", title: "Security Audit", prompt: "Audit the following code for security vulnerabilities. Look for SQL injection, XSS, CSRF, insecure dependencies, exposed secrets, and improper validation. Code: [paste code]" },
  { id: 24, cat: "Coding", title: "Write Docs", prompt: "Write clear technical documentation for [function/API/component]. Include description, parameters with types, return values, example usage, and edge cases to watch for." },
  { id: 25, cat: "Coding", title: "Convert Code", prompt: "Convert the following [language] code to [language]. Maintain the same logic and functionality, use idiomatic patterns for the target language, and add comments. Code: [paste code]" },
  { id: 26, cat: "Coding", title: "Regex Pattern", prompt: "Write a regex pattern that matches [description]. Explain each part of the pattern, provide test cases that should match, and test cases that should not match." },
  { id: 27, cat: "Coding", title: "Optimize SQL", prompt: "Optimize the following SQL query for performance. Suggest indexes, rewrite inefficient joins, remove unnecessary subqueries, and explain each optimization. Query: [paste query]" },
  { id: 28, cat: "Coding", title: "Code Architecture", prompt: "Suggest an architecture for building [application]. Include folder structure, design patterns to use, key libraries, state management approach, and rationale for each decision." },

  // ── Analysis ─────────────────────────────────────────────────────────────
  { id: 29, cat: "Analysis", title: "SWOT Analysis", prompt: "Perform a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for [company/product/idea]. Be specific, honest, and actionable for each quadrant." },
  { id: 30, cat: "Analysis", title: "Pros & Cons", prompt: "List the pros and cons of [decision/topic]. Be objective, thorough, and consider both short-term and long-term implications. Conclude with a recommendation." },
  { id: 31, cat: "Analysis", title: "Summarize Text", prompt: "Summarize the following text into 5 bullet points. Keep key insights, remove fluff, preserve important numbers, and make it easy to scan. Text: [paste text]" },
  { id: 32, cat: "Analysis", title: "Compare Options", prompt: "Compare [option A] vs [option B] across: cost, ease of use, scalability, community, and use cases. Present as a comparison table with a final recommendation." },
  { id: 33, cat: "Analysis", title: "Root Cause Analysis", prompt: "Perform a root cause analysis for [problem]. Use the 5 Whys method, identify contributing factors, and suggest preventive measures for the future." },
  { id: 34, cat: "Analysis", title: "Risk Assessment", prompt: "Identify and assess risks for [project/decision]. For each risk, rate likelihood (1-5), impact (1-5), provide a risk score, and suggest a mitigation strategy." },
  { id: 35, cat: "Analysis", title: "Data Insights", prompt: "Analyze the following data and extract key insights, trends, anomalies, and actionable recommendations. Explain what the data suggests and what to do next. Data: [paste data]" },
  { id: 36, cat: "Analysis", title: "Feedback Analysis", prompt: "Analyze the following customer feedback and identify: top themes, common pain points, positive highlights, and 3 actionable improvements. Feedback: [paste feedback]" },
  { id: 37, cat: "Analysis", title: "Competitor Analysis", prompt: "Analyze [competitor] compared to [your company]. Cover: product features, pricing, target audience, marketing strategy, strengths, and weaknesses. Find gaps to exploit." },
  { id: 38, cat: "Analysis", title: "Trend Report", prompt: "Identify the top 5 trends in [industry/topic] for [year]. For each trend: explain what it is, why it matters, who it affects, and how to capitalize on it." },

  // ── Learning ─────────────────────────────────────────────────────────────
  { id: 39, cat: "Learning", title: "Explain Concept", prompt: "Explain [concept] as if I'm a complete beginner. Use simple language, a real-world analogy, a concrete example, and end with the 3 most important things to remember." },
  { id: 40, cat: "Learning", title: "Study Plan", prompt: "Create a 30-day study plan to learn [skill/topic]. Include daily goals, free resources, milestones for each week, and tips to stay consistent. I have [X] hours per day." },
  { id: 41, cat: "Learning", title: "Quiz Me", prompt: "Create 10 multiple-choice quiz questions about [topic] with varying difficulty. Show the correct answer and a brief explanation after each question." },
  { id: 42, cat: "Learning", title: "ELI5", prompt: "Explain [concept] like I'm five years old. Use the simplest words possible, a fun analogy, and keep your entire explanation under 100 words." },
  { id: 43, cat: "Learning", title: "Key Takeaways", prompt: "What are the 7 most important things a beginner should know about [topic]? Focus on practical, actionable knowledge that gives the most value first." },
  { id: 44, cat: "Learning", title: "Teach Back", prompt: "I just learned about [topic]. Here's my understanding: [your explanation]. Correct any mistakes, fill gaps, and suggest what I should learn next." },
  { id: 45, cat: "Learning", title: "Mental Models", prompt: "What are the best mental models for understanding [topic/field]? For each model, explain it, give an example, and describe when to apply it." },
  { id: 46, cat: "Learning", title: "Resource List", prompt: "Give me the best free resources to learn [topic]. Include: books, YouTube channels, websites, courses, and communities. Rank them from beginner to advanced." },
  { id: 47, cat: "Learning", title: "Misconceptions", prompt: "What are the most common misconceptions about [topic]? For each one, explain the myth, the truth, and why people get it wrong." },
  { id: 48, cat: "Learning", title: "Cheat Sheet", prompt: "Create a concise cheat sheet for [topic/tool/language]. Include the most important commands, syntax, rules, and examples a practitioner needs daily." },

  // ── Productivity ─────────────────────────────────────────────────────────
  { id: 49, cat: "Productivity", title: "Meeting Agenda", prompt: "Create a [duration] meeting agenda about [topic]. Include time slots, discussion points, goals, pre-read materials, and who owns each agenda item." },
  { id: 50, cat: "Productivity", title: "Action Plan", prompt: "Create a step-by-step action plan to achieve [goal] in [timeframe]. Break into weekly milestones, identify blockers, assign owners, and define success metrics." },
  { id: 51, cat: "Productivity", title: "Brainstorm Ideas", prompt: "Brainstorm 20 creative ideas for [topic/problem]. Include obvious ideas, unconventional ones, and wild bets. Briefly explain each and flag the top 3 most promising." },
  { id: 52, cat: "Productivity", title: "Decision Framework", prompt: "Help me decide between [option A] and [option B]. My priorities are [list priorities]. Walk me through a structured decision framework and give a clear recommendation." },
  { id: 53, cat: "Productivity", title: "Prioritize Tasks", prompt: "I have these tasks: [list tasks]. Help me prioritize them using the Eisenhower Matrix (urgent/important). Tell me what to do first, delegate, schedule, and eliminate." },
  { id: 54, cat: "Productivity", title: "Project Brief", prompt: "Write a project brief for [project]. Include: objective, scope, deliverables, timeline, stakeholders, budget, risks, and definition of done." },
  { id: 55, cat: "Productivity", title: "Weekly Review", prompt: "Guide me through a weekly review. Ask me about: what I accomplished, what I didn't finish, lessons learned, and what my top 3 priorities are for next week." },
  { id: 56, cat: "Productivity", title: "SOP Template", prompt: "Write a Standard Operating Procedure (SOP) for [task/process]. Include purpose, scope, step-by-step instructions, responsible parties, and quality checkpoints." },

  // ── Creative ─────────────────────────────────────────────────────────────
  { id: 57, cat: "Creative", title: "Story Starter", prompt: "Write the opening paragraph of a [genre] story set in [setting] featuring a protagonist who [character trait]. Make it gripping and leave the reader wanting more." },
  { id: 58, cat: "Creative", title: "Tagline Ideas", prompt: "Generate 15 catchy taglines for [brand/product]. Each under 8 words, memorable, and conveying the core value. Include serious, playful, and bold options." },
  { id: 59, cat: "Creative", title: "Name Generator", prompt: "Generate 20 name ideas for [product/company/project]. Include descriptive, abstract, and metaphorical names. Mark your top 5 picks and explain the meaning of each." },
  { id: 60, cat: "Creative", title: "Social Media Bio", prompt: "Write 3 versions of a social media bio for [name/brand]: one professional, one casual, one creative. Each under 160 characters and including key info." },
  { id: 61, cat: "Creative", title: "Character Profile", prompt: "Create a detailed character profile for [character name]. Include: backstory, personality traits, strengths, flaws, goals, fears, and speech patterns." },
  { id: 62, cat: "Creative", title: "World Building", prompt: "Help me build a fictional world for [story genre]. Define: geography, political systems, culture, magic/technology, history, and the central conflict driving the story." },
  { id: 63, cat: "Creative", title: "Poem", prompt: "Write a [style] poem about [topic/emotion]. Use vivid imagery, strong verbs, and an unexpected metaphor. Aim for [number] lines." },
  { id: 64, cat: "Creative", title: "Script Scene", prompt: "Write a [2-3 minute] script scene between [character A] and [character B] about [conflict/topic]. Include stage directions, subtext, and a clear emotional arc." },

  // ── Marketing ────────────────────────────────────────────────────────────
  { id: 65, cat: "Marketing", title: "Ad Copy", prompt: "Write 5 variations of ad copy for [product] targeting [audience]. Include: headline (max 10 words), description (max 30 words), and CTA. Test different angles: fear, desire, curiosity." },
  { id: 66, cat: "Marketing", title: "Value Proposition", prompt: "Write a clear value proposition for [product/service]. Format: For [target customer] who [problem], [product] is a [category] that [benefit]. Unlike [alternative], we [differentiator]." },
  { id: 67, cat: "Marketing", title: "Customer Persona", prompt: "Create a detailed buyer persona for [product]. Include: name, age, job, income, goals, pain points, objections, preferred channels, and what they read/watch." },
  { id: 68, cat: "Marketing", title: "Content Calendar", prompt: "Create a 4-week content calendar for [brand] on [platform]. Include post topics, formats, captions, hashtags, and posting times. Theme for the month: [theme]." },
  { id: 69, cat: "Marketing", title: "Cold Outreach", prompt: "Write a cold email/DM to [prospect] offering [product/service]. Keep it under 100 words, personalize it for [their industry], focus on their problem, and end with a soft CTA." },
  { id: 70, cat: "Marketing", title: "Campaign Brief", prompt: "Write a marketing campaign brief for [goal]. Include: objective, target audience, key message, channels, budget range, timeline, KPIs, and creative direction." },
  { id: 71, cat: "Marketing", title: "Landing Page Copy", prompt: "Write copy for a landing page for [product]. Include: hero headline, subheadline, 3 feature/benefit sections, social proof, FAQ, and CTA. Focus on conversion." },
  { id: 72, cat: "Marketing", title: "Product Launch Plan", prompt: "Create a product launch plan for [product] targeting [audience]. Cover: pre-launch, launch day, and post-launch activities, with channels, messaging, and success metrics." },
  { id: 73, cat: "Marketing", title: "Referral Program", prompt: "Design a referral program for [business]. Include: incentive structure, messaging, how it works, email templates for inviting referrals, and tracking approach." },
  { id: 74, cat: "Marketing", title: "Testimonial Request", prompt: "Write an email asking [customer] for a testimonial about [product]. Keep it short, make it easy to respond, suggest 3 guiding questions, and thank them genuinely." },

  // ── Career ───────────────────────────────────────────────────────────────
  { id: 75, cat: "Career", title: "Resume Bullet", prompt: "Rewrite these resume bullets for a [job title] role using the STAR format. Make them achievement-focused with metrics. Bullets: [paste bullets]" },
  { id: 76, cat: "Career", title: "Interview Prep", prompt: "Give me 15 likely interview questions for a [job title] at [company type]. For each, suggest what the interviewer is really looking for and a strong answer framework." },
  { id: 77, cat: "Career", title: "Salary Negotiation", prompt: "Help me negotiate a salary for [role] offering [amount]. I want [target amount]. Write a script for the negotiation conversation, including how to handle common pushbacks." },
  { id: 78, cat: "Career", title: "Performance Review", prompt: "Help me write a self-review for my performance over the past [period]. I accomplished: [list]. My strengths: [list]. Areas to grow: [list]. Make it concise and impactful." },
  { id: 79, cat: "Career", title: "Networking Message", prompt: "Write a personalized LinkedIn connection request to [person] at [company]. Mention a genuine reason for connecting, keep it under 200 characters, and don't pitch anything." },
  { id: 80, cat: "Career", title: "Career Pivot", prompt: "I want to transition from [current role] to [target role]. Identify transferable skills, gaps I need to fill, steps to make the switch, and how to frame my experience." },
  { id: 81, cat: "Career", title: "Promotion Case", prompt: "Help me build a case for a promotion from [current title] to [target title]. Structure my accomplishments, impact, and readiness in a compelling, data-driven narrative." },
  { id: 82, cat: "Career", title: "Resignation Email", prompt: "Write a professional resignation email to [manager]. Give [notice period] notice, express gratitude, offer to help with the transition, and keep a positive tone." },

  // ── Business ─────────────────────────────────────────────────────────────
  { id: 83, cat: "Business", title: "Business Plan", prompt: "Write a business plan outline for [idea]. Include: executive summary, problem/solution, market size, business model, go-to-market, competitive landscape, and financials overview." },
  { id: 84, cat: "Business", title: "Pitch Deck Script", prompt: "Write a 5-minute investor pitch script for [startup]. Cover: problem, solution, market, traction, team, business model, ask. Make it compelling and memorable." },
  { id: 85, cat: "Business", title: "OKRs", prompt: "Write OKRs (Objectives and Key Results) for [team/company] for [quarter]. Include 3 objectives, each with 3-4 measurable key results. Align them with [company goal]." },
  { id: 86, cat: "Business", title: "Go-to-Market", prompt: "Create a go-to-market strategy for [product] targeting [audience]. Cover: ICP, positioning, channels, pricing, launch sequence, and 90-day milestones." },
  { id: 87, cat: "Business", title: "Customer Interview", prompt: "Write 15 open-ended customer discovery questions to understand [problem space]. Focus on current behavior, pain points, workarounds, and decision-making. Avoid leading questions." },
  { id: 88, cat: "Business", title: "Partnership Proposal", prompt: "Write a partnership proposal to [company] for [type of partnership]. Include mutual benefits, what each party brings, revenue sharing model, and proposed next steps." },
  { id: 89, cat: "Business", title: "Pricing Strategy", prompt: "Recommend a pricing strategy for [product]. Consider: competitor pricing, cost structure, target margin, customer willingness to pay, and psychological pricing principles." },
  { id: 90, cat: "Business", title: "Investor Update", prompt: "Write a monthly investor update email for [company]. Include: highlights, metrics vs targets, challenges, asks, and next month's focus. Keep it to one page." },

  // ── SEO ──────────────────────────────────────────────────────────────────
  { id: 91, cat: "SEO", title: "Meta Description", prompt: "Write 3 meta descriptions for a page about [topic]. Each under 155 characters, include the keyword [keyword], be compelling to click, and accurately describe the content." },
  { id: 92, cat: "SEO", title: "Keyword Research", prompt: "Generate a keyword research plan for [topic]. Include: seed keywords, long-tail variations, question-based keywords, and search intent (informational/commercial/transactional)." },
  { id: 93, cat: "SEO", title: "Title Tags", prompt: "Write 5 SEO title tags for a page about [topic]. Each under 60 characters, include [main keyword], be compelling, and avoid keyword stuffing." },
  { id: 94, cat: "SEO", title: "Content Brief", prompt: "Create an SEO content brief for an article targeting [keyword]. Include: target audience, search intent, H1/H2/H3 structure, word count, internal links, and FAQs to cover." },
  { id: 95, cat: "SEO", title: "Schema Markup", prompt: "Write JSON-LD schema markup for a [type: Article/Product/FAQ/etc] page about [topic]. Include all relevant fields and explain where to place it on the page." },
  { id: 96, cat: "SEO", title: "SEO Audit Checklist", prompt: "Audit [website URL / describe site] for SEO issues. Check: title tags, meta descriptions, header hierarchy, page speed, mobile-friendliness, internal linking, and content gaps." },

  // ── Social Media ─────────────────────────────────────────────────────────
  { id: 97, cat: "Social Media", title: "Instagram Caption", prompt: "Write 3 Instagram captions for a post about [topic/product]. Include a hook, story or value, and a CTA. Add relevant emojis and 10 hashtags for each." },
  { id: 98, cat: "Social Media", title: "YouTube Script", prompt: "Write a YouTube script for a [duration] video about [topic]. Include hook (first 30 sec), main content sections, transitions, and a strong CTA at the end." },
  { id: 99, cat: "Social Media", title: "TikTok Hook Ideas", prompt: "Write 10 hook ideas for a TikTok video about [topic]. Each hook should stop the scroll in the first 2 seconds. Use curiosity, controversy, or a bold claim." },
  { id: 100, cat: "Social Media", title: "Pinterest Pin", prompt: "Write a Pinterest pin title and description for [topic]. Title: keyword-rich, under 100 chars. Description: 200-500 chars, include keywords naturally, and add a CTA." },
  { id: 101, cat: "Social Media", title: "Twitter/X Bio", prompt: "Write 5 versions of a Twitter/X bio for [person/brand]. Each under 160 characters. Mix professional and personality. Include what you do and who you help." },
  { id: 102, cat: "Social Media", title: "Viral Post Formula", prompt: "Using the [AIDA/PAS/BAB] copywriting formula, write a viral [platform] post about [topic]. Explain which formula you're using and why it works for this topic." },
  { id: 103, cat: "Social Media", title: "Comment Response", prompt: "Write professional responses to these [positive/negative/neutral] comments about [product/brand]: [paste comments]. Be authentic, on-brand, and avoid sounding defensive." },
  { id: 104, cat: "Social Media", title: "Story Ideas", prompt: "Give me 20 Instagram/Facebook story ideas for [brand/topic]. Mix: behind-the-scenes, polls, Q&A, tips, customer stories, and product highlights." },

  // ── Design ───────────────────────────────────────────────────────────────
  { id: 105, cat: "Design", title: "Design Brief", prompt: "Write a design brief for [project]. Include: project overview, target audience, design goals, brand guidelines, deliverables, timeline, and examples of styles you like/dislike." },
  { id: 106, cat: "Design", title: "UX Copy", prompt: "Write UX microcopy for [feature/screen]. Include: headline, subheadline, button labels, error messages, empty states, and tooltips. Prioritize clarity over cleverness." },
  { id: 107, cat: "Design", title: "Color Palette", prompt: "Suggest a color palette for [brand type/mood]. Include: primary, secondary, accent, background, and text colors with hex codes. Explain the psychology behind each choice." },
  { id: 108, cat: "Design", title: "User Flow", prompt: "Map out the user flow for [feature]. List every screen/step a user goes through, decision points, error states, and edge cases from entry point to goal completion." },
  { id: 109, cat: "Design", title: "Accessibility Review", prompt: "Review the following UI description for accessibility issues. Check: color contrast, keyboard navigation, screen reader compatibility, touch targets, and WCAG 2.1 AA compliance. UI: [describe]" },
  { id: 110, cat: "Design", title: "Wireframe Prompt", prompt: "Describe the wireframe layout for a [page type] page for [product]. Include sections, their order, key elements in each section, and the hierarchy of information." },

  // ── Research ─────────────────────────────────────────────────────────────
  { id: 111, cat: "Research", title: "Literature Review", prompt: "Summarize what is currently known about [topic] based on research. Cover: key findings, major theories, areas of consensus, ongoing debates, and gaps in the literature." },
  { id: 112, cat: "Research", title: "Survey Questions", prompt: "Write a 10-question survey to measure [goal]. Include: rating scales, multiple choice, and open-ended questions. Avoid leading or double-barreled questions." },
  { id: 113, cat: "Research", title: "Research Proposal", prompt: "Write a research proposal for studying [topic]. Include: research question, hypothesis, methodology, data sources, limitations, and expected outcomes." },
  { id: 114, cat: "Research", title: "Statistical Summary", prompt: "Interpret the following statistical results in plain English. Explain what the numbers mean, whether the findings are significant, and practical implications. Data: [paste data]" },
  { id: 115, cat: "Research", title: "Interview Script", prompt: "Write a user research interview script for understanding [user behavior/problem]. Include intro, warm-up questions, core questions, probing follow-ups, and closing." },
  { id: 116, cat: "Research", title: "Citation Summary", prompt: "Summarize the key argument, methodology, findings, and limitations of this paper: [paste abstract or paper details]. Then explain how it relates to [your topic]." },

  // ── Finance ──────────────────────────────────────────────────────────────
  { id: 117, cat: "Finance", title: "Budget Plan", prompt: "Create a monthly budget template for someone earning [income] in [city]. Allocate amounts for: housing, food, transport, savings, investments, entertainment, and emergency fund." },
  { id: 118, cat: "Finance", title: "Investment Thesis", prompt: "Write an investment thesis for [asset/company]. Cover: what it is, why now, the bull case, bear case, key risks, and how to track if the thesis is playing out." },
  { id: 119, cat: "Finance", title: "Financial Model", prompt: "Build a simple financial model for [business]. Include assumptions, revenue drivers, cost structure, P&L summary, and 3 scenarios: base, bull, and bear case." },
  { id: 120, cat: "Finance", title: "Expense Report", prompt: "Write a concise expense report for [trip/project]. Include a summary table of categories, totals, business justification for major items, and any anomalies to flag." },
  { id: 121, cat: "Finance", title: "Fundraising Ask", prompt: "Help me write a fundraising ask for [organization/cause]. Include: the impact, the specific amount needed, what it will fund, urgency, and a compelling call-to-action." },
  { id: 122, cat: "Finance", title: "Investor Pitch", prompt: "Write a 3-paragraph investor pitch for [startup]. Cover: the problem and market size, your solution and traction, and what you're raising and how you'll use the funds." },

  // ── Health ───────────────────────────────────────────────────────────────
  { id: 123, cat: "Health", title: "Workout Plan", prompt: "Create a [duration] workout plan for [goal: weight loss/muscle gain/endurance] with [X] days per week. Include exercises, sets, reps, and rest times. Assume [beginner/intermediate/advanced]." },
  { id: 124, cat: "Health", title: "Meal Plan", prompt: "Create a 7-day meal plan for [goal]. Include breakfast, lunch, dinner, and snacks. Keep it under [calories], high in [nutrient], and include a shopping list." },
  { id: 125, cat: "Health", title: "Habit Tracker", prompt: "Design a 30-day habit-building plan for [habit]. Include: daily actions, weekly check-ins, how to handle missed days, rewards, and how to make it stick long-term." },
  { id: 126, cat: "Health", title: "Stress Management", prompt: "Suggest a practical stress management routine for someone who [situation]. Include: morning routine, micro-breaks during work, evening wind-down, and weekly reset practices." },
  { id: 127, cat: "Health", title: "Sleep Hygiene", prompt: "Create a sleep improvement plan for someone struggling with [sleep issue]. Include: evening routine, environment adjustments, things to avoid, and a realistic 2-week timeline." },
  { id: 128, cat: "Health", title: "Nutrition Guide", prompt: "Explain the nutritional basics of [diet type: keto/vegan/Mediterranean/etc]. Cover: what to eat, what to avoid, sample day of eating, common mistakes, and who it suits best." },
];

const CATS = ["All", ...Array.from(new Set(PROMPTS.map(p => p.cat)))];

export default function App() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = PROMPTS.filter(p =>
    (cat === "All" || p.cat === cat) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.prompt.toLowerCase().includes(search.toLowerCase()))
  );

  async function copy(p: typeof PROMPTS[0]) {
    await navigator.clipboard.writeText(p.prompt);
    setCopied(p.id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-[#09051a] flex flex-col">
      <Link
        to="/projects/ai-prompt-library"
        className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-12 mt-4 ml-4"
      >
        ← Back
      </Link>
      <div className="bg-[#8748c7] px-6 py-5">
        <h1 className="text-white font-semibold text-lg">AI Prompt Library</h1>
        <p className="text-[#d4a8ff] text-sm mt-0.5">{PROMPTS.length} prompts · Click to copy</p>
      </div>

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 space-y-4">

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search prompts…"
          className="w-full bg-[#120d24] border border-[#8748c7]/25 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a]"
        />

        <div className="flex gap-2 flex-wrap">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${cat === c
                ? "bg-[#8748c7] text-white"
                : "bg-[#120d24] text-[#5a4a7a] border border-[#8748c7]/20 hover:text-[#8748c7]"
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-[#3a2a6a] text-sm text-center py-8">No prompts found.</p>
          )}
          {filtered.map(p => (
            <div key={p.id} className="bg-[#120d24] border border-[#8748c7]/20 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#1a0e30] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#8748c7] border border-[#8748c7]/30 rounded-md px-2 py-0.5 font-medium">{p.cat}</span>
                  <span className="text-white text-sm font-medium">{p.title}</span>
                </div>
                <span className="text-[#4a3a7a] text-xs ml-2">{expanded === p.id ? "▴" : "▾"}</span>
              </button>

              {expanded === p.id && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-[#8b7aaa] text-sm leading-relaxed">{p.prompt}</p>
                  <button
                    onClick={() => copy(p)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${copied === p.id
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "border-[#8748c7]/40 text-[#8748c7] hover:bg-[#8748c7]/10"
                      }`}
                  >
                    {copied === p.id ? "✓ Copied" : "Copy Prompt"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}