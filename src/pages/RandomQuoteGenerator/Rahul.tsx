import { useState } from "react";
import { Link } from "react-router";

const QUOTES = [
    { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
    { q: "In the middle of every difficulty lies opportunity.", a: "Albert Einstein" },
    { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
    { q: "Life is what happens when you're busy making other plans.", a: "John Lennon" },
    { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
    { q: "Strive not to be a success, but rather to be of value.", a: "Albert Einstein" },
    { q: "You miss 100% of the shots you don't take.", a: "Wayne Gretzky" },
    { q: "Whether you think you can or you think you can't, you're right.", a: "Henry Ford" },
    { q: "The best time to plant a tree was 20 years ago. The second best time is now.", a: "Chinese Proverb" },
    { q: "An unexamined life is not worth living.", a: "Socrates" },
    { q: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", a: "Mother Teresa" },
    { q: "When you reach the end of your rope, tie a knot in it and hang on.", a: "Franklin D. Roosevelt" },
    { q: "Always remember that you are absolutely unique. Just like everyone else.", a: "Margaret Mead" },
    { q: "Do not go where the path may lead, go instead where there is no path and leave a trail.", a: "Ralph Waldo Emerson" },
    { q: "You will face many defeats in life, but never let yourself be defeated.", a: "Maya Angelou" },
    { q: "The greatest glory in living lies not in never falling, but in rising every time we fall.", a: "Nelson Mandela" },
    { q: "In the end, it's not the years in your life that count. It's the life in your years.", a: "Abraham Lincoln" },
    { q: "Never let the fear of striking out keep you from playing the game.", a: "Babe Ruth" },
    { q: "Life is either a daring adventure or nothing at all.", a: "Helen Keller" },
    { q: "Many of life's failures are people who did not realize how close they were to success when they gave up.", a: "Thomas A. Edison" },
    { q: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", a: "Dr. Seuss" },
    { q: "If life were predictable it would cease to be life, and be without flavor.", a: "Eleanor Roosevelt" },
    { q: "If you look at what you have in life, you'll always have more.", a: "Oprah Winfrey" },
    { q: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", a: "James Cameron" },
    { q: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", a: "Maya Angelou" },
    { q: "If you want to live a happy life, tie it to a goal, not to people or things.", a: "Albert Einstein" },
    { q: "Never let the fear of striking out keep you from playing the game.", a: "Babe Ruth" },
    { q: "Money and success don't change people; they merely amplify what is already there.", a: "Will Smith" },
    { q: "Your time is limited, so don't waste it living someone else's life.", a: "Steve Jobs" },
    { q: "Not how long, but how well you have lived is the main thing.", a: "Seneca" },
    { q: "If life were predictable it would cease to be life.", a: "Eleanor Roosevelt" },
    { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins" },
    { q: "In this life we cannot do great things. We can only do small things with great love.", a: "Mother Teresa" },
    { q: "Only a life lived for others is a life worthwhile.", a: "Albert Einstein" },
    { q: "The purpose of our lives is to be happy.", a: "Dalai Lama" },
    { q: "Get busy living or get busy dying.", a: "Stephen King" },
    { q: "You only live once, but if you do it right, once is enough.", a: "Mae West" },
    { q: "He who has a why to live can bear almost any how.", a: "Friedrich Nietzsche" },
    { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
    { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
    { q: "Don't judge each day by the harvest you reap but by the seeds that you plant.", a: "Robert Louis Stevenson" },
    { q: "You are never too old to set another goal or to dream a new dream.", a: "C.S. Lewis" },
    { q: "To see the world, things dangerous to come to, to see behind walls, to draw closer.", a: "James Thurber" },
    { q: "First, have a definite, clear practical ideal; a goal, an objective.", a: "Aristotle" },
    { q: "Twenty years from now you will be more disappointed by the things you didn't do than by the ones you did.", a: "Mark Twain" },
    { q: "The only way out of the labyrinth of suffering is to forgive.", a: "John Green" },
    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
    { q: "I am not a product of my circumstances. I am a product of my decisions.", a: "Stephen Covey" },
    { q: "Every child is an artist. The problem is how to remain an artist once we grow up.", a: "Pablo Picasso" },
    { q: "You can never cross the ocean until you have the courage to lose sight of the shore.", a: "Christopher Columbus" },
    { q: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", a: "Maya Angelou" },
    { q: "Either you run the day, or the day runs you.", a: "Jim Rohn" },
    { q: "Whether you think you can or you think you can't, you're right.", a: "Henry Ford" },
    { q: "The two most important days in your life are the day you are born and the day you find out why.", a: "Mark Twain" },
    { q: "Whatever the mind of man can conceive and believe, it can achieve.", a: "Napoleon Hill" },
    { q: "Eighty percent of success is showing up.", a: "Woody Allen" },
    { q: "I attribute my success to this: I never gave or took any excuse.", a: "Florence Nightingale" },
    { q: "You miss 100% of the shots you don't take.", a: "Wayne Gretzky" },
    { q: "I've missed more than 9,000 shots in my career. I've lost almost 300 games. I've failed over and over and that is why I succeed.", a: "Michael Jordan" },
    { q: "The most common way people give up their power is by thinking they don't have any.", a: "Alice Walker" },
    { q: "The mind is everything. What you think you become.", a: "Buddha" },
    { q: "The best revenge is massive success.", a: "Frank Sinatra" },
    { q: "People who are crazy enough to think they can change the world are the ones who do.", a: "Rob Siltanen" },
    { q: "Failure will never overtake me if my determination to succeed is strong enough.", a: "Og Mandino" },
    { q: "We may encounter many defeats but we must not be defeated.", a: "Maya Angelou" },
    { q: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", a: "Johann Wolfgang Von Goethe" },
    { q: "Imagine your life is perfect in every respect; what would it look like?", a: "Brian Tracy" },
    { q: "We generate fears while we sit. We overcome them by action.", a: "Dr. Henry Link" },
    { q: "Security is mostly a superstition. Life is either a daring adventure or nothing.", a: "Helen Keller" },
    { q: "The man who has confidence in himself gains the confidence of others.", a: "Hasidic Proverb" },
    { q: "The only thing we have to fear is fear itself.", a: "Franklin D. Roosevelt" },
    { q: "Perfection is not attainable, but if we chase perfection we can catch excellence.", a: "Vince Lombardi" },
    { q: "Life is 10% what happens to you and 90% how you react to it.", a: "Charles R. Swindoll" },
    { q: "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.", a: "Oprah Winfrey" },
];

function pick() {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export default function App() {
    const [quote, setQuote] = useState(pick);
    const [copied, setCopied] = useState(false);

    function regenerate() {
        setCopied(false);
        setQuote(pick());
    }

    async function copy() {
        await navigator.clipboard.writeText(`"${quote.q}" — ${quote.a}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="min-h-screen bg-[#09051a] flex justify-center p-6">
            <div className="w-full max-w-md">
                <Link
                    to="/projects/random-quote-generator"
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors"
                >
                    ← Back
                </Link>
                <div className="rounded-2xl overflow-hidden border border-[#8748c7]/30 shadow-xl shadow-[#8748c7]/10 mt-12">

                    <div className="bg-[#8748c7] px-6 py-6 flex items-start justify-between">
                        <div>
                            <h1 className="text-white font-semibold text-lg tracking-tight">Random Quote</h1>
                            <p className="text-[#d4a8ff] text-sm mt-0.5">{QUOTES.length} quotes</p>
                        </div>
                    </div>

                    <div className="bg-[#120d24] px-6 py-6 space-y-6">
                        <div className="min-h-[140px] flex flex-col justify-center">
                            <p className="text-[#8748c7] text-4xl font-serif leading-none mb-3">"</p>
                            <p className="text-white text-base leading-relaxed">{quote.q}</p>
                            <p className="text-[#8748c7] text-sm font-medium mt-3">— {quote.a}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={regenerate}
                                className="flex-1 py-3 rounded-xl bg-[#8748c7] hover:bg-[#9b5ad4] active:bg-[#7338b0] text-white text-sm font-medium transition-all active:scale-[0.98]"
                            >
                                Regenerate
                            </button>
                            <button
                                onClick={copy}
                                className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all active:scale-95 ${copied
                                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                                        : "border-[#8748c7]/40 text-[#8748c7] hover:bg-[#8748c7]/10"
                                    }`}
                            >
                                {copied ? "✓" : "Copy"}
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}