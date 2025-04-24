import { useState } from "react";
import { motion } from "framer-motion";

const participants = [
  "Suède", "France", "Italie", "Espagne", "Norvège",
  "Allemagne", "Ukraine", "Royaume-Uni", "Grèce", "Serbie"
];

const initialVotes = participants.reduce((acc, country) => {
  acc[country] = 0;
  return acc;
}, {});

export default function EurovisionVoting() {
  const [votes, setVotes] = useState(initialVotes);
  const [userVotes, setUserVotes] = useState([]);
  const [currentVoter, setCurrentVoter] = useState(1);
  const [votingComplete, setVotingComplete] = useState(false);

  const handleVote = (country, points) => {
    setUserVotes(prev => {
      const updated = prev.filter(v => v.country !== country);
      return [...updated, { country, points }];
    });
  };

  const finalizeVotes = () => {
    const newVotes = { ...votes };
    userVotes.forEach(({ country, points }) => {
      newVotes[country] += parseInt(points) || 0;
    });
    setVotes(newVotes);
    if (currentVoter >= 4) {
      setVotingComplete(true);
    } else {
      setCurrentVoter(currentVoter + 1);
      setUserVotes([]);
    }
  };

  const sortedResults = Object.entries(votes).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Eurovision 2025 - Votes</h1>
      {!votingComplete ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Votes du participant #{currentVoter}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {participants.map((country) => (
              <div key={country} className="border rounded-xl p-4 shadow space-y-2">
                <div className="text-lg font-medium">{country}</div>
                <input
                  type="number"
                  placeholder="0-12"
                  min={0}
                  max={12}
                  className="border rounded px-2 py-1 w-full"
                  onChange={(e) => handleVote(country, e.target.value)}
                />
              </div>
            ))}
          </div>
          <button onClick={finalizeVotes} className="px-4 py-2 bg-blue-600 text-white rounded-xl mt-4">
            Soumettre les votes du participant #{currentVoter}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Résultats finaux</h2>
          <div className="space-y-2">
            {sortedResults.map(([country, score], index) => (
              <motion.div
                key={country}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-2 rounded-xl shadow bg-white text-lg font-semibold"
              >
                #{index + 1} - {country}: {score} points
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
