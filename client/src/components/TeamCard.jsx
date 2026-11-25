import React from 'react';
import { Link } from 'react-router-dom';

const TeamCard = ({ team }) => {
  return (
    <Link
      to={`/laliga/teams/${team.id}`}
      className="group relative flex flex-col items-center p-5 rounded-3xl border border-[#004D98]/30 bg-gradient-to-br from-[#060F2B]/90 via-[#030718]/95 to-[#081335]/90 hover:border-[#0055B3]/60 backdrop-blur-2xl transition-all duration-300 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(0,77,152,0.4),0_0_20px_rgba(237,187,0,0.2)] hover:-translate-y-1.5 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#004D98] via-[#EDBB00] to-[#0055B3] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_#EDBB00]" />

      <div className="w-16 h-16 mb-3 p-2 rounded-2xl bg-[#030718] border border-[#004D98]/30 group-hover:scale-105 group-hover:border-[#0055B3]/60 transition-all flex items-center justify-center shadow-inner">
        {team.crest_url ? (
          <img
            src={team.crest_url}
            alt={team.name}
            className="w-full h-full object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span className="font-extrabold text-lg text-slate-400">{team.tla || team.short_name?.substring(0, 3)}</span>
        )}
      </div>

      <h3 className="font-bold text-slate-100 group-hover:text-[#EDBB00] transition-colors text-center text-sm truncate w-full">
        {team.name}
      </h3>
      <p className="text-xs text-slate-400 mt-1">{team.city}</p>

      <div className="mt-3 pt-3 border-t border-[#004D98]/20 w-full flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[120px]">{team.stadium}</span>
        {team.founded_year && <span className="font-mono text-slate-400">Est. {team.founded_year}</span>}
      </div>
    </Link>
  );
};

export default TeamCard;
