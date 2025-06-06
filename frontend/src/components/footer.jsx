'use client';

import { useEffect, useState } from "react";
import { buildPrompt } from "@/lib/llmpromptbuilder";
import removeMarkdown from "remove-markdown";
import Header from "@/components/header";

export default function RecommendPage() {
    const [recommendation, setRecommendation] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("clinicalData"));
        const prediction = localStorage.getItem("pcosPrediction");

        const prompt = buildPrompt(data, prediction);

        fetch("/api/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        })
            .then((res) => res.json())
            .then((res) => {
                const plainText = removeMarkdown(res.response);
                setRecommendation(plainText);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#FFF0F5]">
            <Header />

            <div className="max-w-3xl mx-auto py-16 px-6">
                <h1 className="text-4xl font-serif font-bold text-center text-pink-700 mb-6">
                    🌸 Your Personalized Wellness Plan
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center mt-12">
                        <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-pink-50 text-gray-800 p-6 rounded-2xl shadow-xl border border-pink-100 transition-all duration-300">
                        <pre className="whitespace-pre-wrap font-sans leading-relaxed tracking-wide text-lg">
                            {recommendation}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
