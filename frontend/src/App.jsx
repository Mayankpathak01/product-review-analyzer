import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, AlertCircle, Star, Sparkles, BarChart3, Users, Download, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import './index.css'; // Make sure this file exists

export default function ProductReviewAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  


  const analyzeReviews = async () => {
    if (!url.trim()) {
      setError('Please enter a valid product URL');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      // Call backend API 
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to analyze reviews');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze. Make sure backend is running on port 5000.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!analysis) return;
    
    const reportData = {
      productUrl: url,
      analysisDate: new Date().toLocaleDateString(),
      overallRating: analysis.rating,
      totalReviews: analysis.totalReviews,
      sentiment: analysis.overallSentiment,
      summary: analysis.summary,
      pros: analysis.pros,
      cons: analysis.cons,
      insights: analysis.insights,
      keywords: analysis.keywords,
      topReviews: analysis.topReviews
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url_export = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url_export;
    a.download = `product-review-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url_export);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-purple-400" size={36} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Product Review Analyzer
            </h1>
          </div>
          <p className="text-gray-300 text-lg">AI-powered insights from thousands of customer reviews</p>
        </div>

        {/* Search Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-8 border border-white/20">
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="🔗 Paste product URL (Amazon, etc...)"
              className="flex-1 px-5 py-4 bg-white/90 backdrop-blur border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-500 text-lg shadow-lg"
              onKeyPress={(e) => e.key === 'Enter' && analyzeReviews()}
            />
            <button
              onClick={analyzeReviews}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={24} />
                  Analyze
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg backdrop-blur">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* --- Results --- */}
        {analysis && (
          <div className="space-y-6 animate-fade-in">
            {/* Export Button */}
            <div className="flex justify-end">
              <button
                onClick={exportReport}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download size={20} />
                Export Report
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="text-yellow-400 fill-yellow-400" size={32} />
                  <div>
                    <div className="text-4xl font-bold text-white">{analysis.rating}</div>
                    <div className="text-purple-200 text-sm">Average Rating</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-700/20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="text-pink-300" size={32} />
                  <div>
                    <div className="text-4xl font-bold text-white">{analysis.totalReviews.toLocaleString()}</div>
                    <div className="text-pink-200 text-sm">Total Reviews</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-green-700/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="text-green-300" size={32} />
                  <div>
                    <div className="text-2xl font-bold text-white">{analysis.overallSentiment}</div>
                    <div className="text-green-200 text-sm">Sentiment Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Sparkles className="text-purple-400" size={28} />
                Summary
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Keyword Cloud */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <MessageSquare className="text-cyan-400" size={28} />
                Most Mentioned Keywords
              </h2>
              <div className="flex flex-wrap gap-4 justify-center items-center min-h-[200px]">
                {analysis.keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="hover:scale-110 transition-transform cursor-pointer"
                    style={{
                      fontSize: `${keyword.size}px`,
                      color: `hsl(${280 - index * 20}, 70%, ${60 + (index % 3) * 10}%)`
                    }}
                  >
                    <span className="font-bold drop-shadow-lg">{keyword.word}</span>
                    <span className="text-xs text-gray-400 ml-1">({keyword.mentions})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Positive Reviews */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <ThumbsUp className="text-green-400" size={28} />
                  <h3 className="text-2xl font-bold text-white">Top Positive Reviews</h3>
                </div>
                <div className="space-y-4">
                  {analysis.topReviews.positive.map((review, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                          ))}
                        </div>
                        {review.verified && (
                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Verified</span>
                        )}
                      </div>
                      <p className="text-gray-200 italic mb-3">"{review.text}"</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">- {review.author}</span>
                        <span className="text-gray-500">{review.helpful} found helpful</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Critical Reviews */}
              <div className="bg-gradient-to-br from-red-500/10 to-orange-700/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <ThumbsDown className="text-red-400" size={28} />
                  <h3 className="text-2xl font-bold text-white">Top Critical Reviews</h3>
                </div>
                <div className="space-y-4">
                  {analysis.topReviews.negative.map((review, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                          ))}
                        </div>
                        {review.verified && (
                          <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">Verified</span>
                        )}
                      </div>
                      <p className="text-gray-200 italic mb-3">"{review.text}"</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">- {review.author}</span>
                        <span className="text-gray-500">{review.helpful} found helpful</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Rating Distribution</h3>
              <div className="space-y-3">
                {analysis.ratingDistribution.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-white font-semibold">{rating.stars}</span>
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    </div>
                    <div className="flex-1 bg-white/10 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 w-16 text-right">{rating.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-green-400" size={32} />
                <h2 className="text-3xl font-bold text-white">What Customers Love</h2>
              </div>
              <div className="space-y-5">
                {analysis.pros.map((pro, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-5 border-l-4 border-green-400 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-green-400 text-xl">{pro.theme}</h3>
                      <span className="text-green-300 font-semibold">{pro.percentage}%</span>
                    </div>
                    <p className="text-gray-200 leading-relaxed">{pro.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div className="bg-gradient-to-br from-red-500/10 to-orange-700/10 backdrop-blur-lg rounded-2xl p-8 border border-red-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingDown className="text-red-400" size={32} />
                <h2 className="text-3xl font-bold text-white">Areas for Improvement</h2>
              </div>
              <div className="space-y-5">
                {analysis.cons.map((con, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-5 border-l-4 border-red-400 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-red-400 text-xl">{con.theme}</h3>
                      <span className="text-red-300 font-semibold">{con.percentage}%</span>
                    </div>
                    <p className="text-gray-200 leading-relaxed">{con.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-6">Deep Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.insights.map((insight, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <h3 className="font-bold text-purple-300 text-xl mb-3">{insight.topic}</h3>
                    <p className="text-gray-200 leading-relaxed">{insight.analysis}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- Placeholder --- */}
        {!analysis && !loading && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-16 text-center border border-white/10 shadow-xl">
            <Search className="mx-auto text-purple-400/50 mb-6" size={80} />
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Analyze</h3>
            <p className="text-gray-400 text-lg">Paste a product URL above and discover what customers really think</p>
          </div>
        )}
      </div>
    </div>
  );
}


