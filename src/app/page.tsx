"use client";

import sdk from "@farcaster/miniapp-sdk";
import { useEffect, useState, useMemo } from "react";
import { useGameState } from "../hooks/useGameState";

type MiniAppUser = Awaited<typeof sdk.context>["user"];

type View = "home" | "inventory" | "shop" | "quests" | "leaderboard";

export default function Home() {
  const [isInMiniApp, setIsInMiniApp] = useState<boolean | null>(null);
  const [user, setUser] = useState<MiniAppUser | null>(null);
  const [error, setError] = useState<string>("");
  const [activeView, setActiveView] = useState<View>("home");
  const [isDevMode, setIsDevMode] = useState(false);

  // Initialize Game State
  const game = useGameState();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        // Check for dev mode in query params
        const params = new URLSearchParams(window.location.search);
        const dev = params.get("dev") === "true";
        if (dev && isMounted) {
          setIsDevMode(true);
          setIsInMiniApp(true);
          setUser({ fid: 1234, username: "dev_player", pfpUrl: "" } as any);
          return;
        }

        sdk.actions.ready();
        const inMiniApp = await sdk.isInMiniApp();
        if (!isMounted) return;

        setIsInMiniApp(inMiniApp);
        if (inMiniApp) {
          const context = await sdk.context;
          if (!isMounted) return;
          setUser(context.user ?? null);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Mini-app init failed.");
      }
    };

    init();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isInMiniApp === null) {
    return (
      <main className="min-h-screen grid place-items-center p-5 bg-[#0b1220]">
        <div className="w-full max-w-[480px] border border-white/10 bg-[rgba(15,23,42,0.8)] backdrop-blur-xl rounded-[24px] p-8 text-center">
          <div className="w-12 h-12 border-4 border-t-[#5c7cff] border-white/10 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm tracking-wider uppercase text-[#9fc2ff] font-medium">
            Waking up the boxes...
          </p>
        </div>
      </main>
    );
  }

  if (!isInMiniApp) {
    return (
      <main className="min-h-screen grid place-items-center p-5 bg-[#0b1220]">
        <div className="w-full max-w-[480px] border border-white/10 bg-[rgba(15,23,42,0.8)] backdrop-blur-xl rounded-[24px] p-8 text-center shadow-2xl">
          <div className="mb-6 text-5xl">📦</div>
          <h1 className="text-2xl font-bold mb-3 text-white">Open in Base App</h1>
          <p className="text-[#b7c6e6] mb-8 text-sm leading-relaxed">
            Please launch this app from the Base or Farcaster app to start your daily reward journey.
          </p>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-left">
            <p className="text-xs text-[#9fc2ff] uppercase font-bold mb-1">Developer Tip</p>
            <p className="text-xs text-[#b7c6e6]">Use <code className="bg-white/10 px-1 rounded">?dev=true</code> to test locally.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#0b1220] text-white">
      {/* HUD / Header */}
      <header className="p-5 flex items-center justify-between border-b border-white/5 bg-[rgba(15,23,42,0.4)] backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5c7cff] to-[#ff5c7c] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#0b1220] overflow-hidden flex items-center justify-center">
              {user?.pfpUrl ? (
                <img src={user.pfpUrl} alt="pfp" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold">{user?.username?.slice(0, 2).toUpperCase() || "U"}</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-white/60 font-medium">@{user?.username || "Player"}</p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-[#7cff5c]">{game.streak}🔥</span>
              <span className="text-[10px] text-white/40 uppercase font-black">Streak</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="text-[#eab308] text-sm font-black">🪙</span>
            <span className="text-sm font-mono font-bold">{game.coins.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        {activeView === "home" && <HomeView game={game} />}
        {activeView === "inventory" && <InventoryView game={game} />}
        {activeView === "shop" && <ShopView game={game} />}
        {activeView === "quests" && <QuestsView game={game} />}
        {activeView === "leaderboard" && <LeaderboardView game={game} />}
      </div>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 bg-[rgba(15,23,42,0.8)] backdrop-blur-2xl border-t border-white/10 flex justify-between items-center gap-2 z-20">
        <NavButton active={activeView === "home"} onClick={() => setActiveView("home")} icon="📦" label="Boxes" />
        <NavButton active={activeView === "inventory"} onClick={() => setActiveView("inventory")} icon="🎒" label="Inv" />
        <NavButton active={activeView === "shop"} onClick={() => setActiveView("shop")} icon="🛒" label="Shop" />
        <NavButton active={activeView === "quests"} onClick={() => setActiveView("quests")} icon="🎯" label="Daily" />
        <NavButton active={activeView === "leaderboard"} onClick={() => setActiveView("leaderboard")} icon="🏆" label="Top" />
      </nav>
    </main>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all ${active ? 'bg-white/10 text-white' : 'text-white/40'}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span>
    </button>
  );
}

// Sub-views 
function HomeView({ game }: { game: any }) {
  const [opening, setOpening] = useState(false);
  const [reward, setReward] = useState<any>(null);

  const canClaim = useMemo(() => {
    if (!game.lastClaimDate) return true;
    const last = new Date(game.lastClaimDate);
    const now = new Date();
    // Allow claim if never claimed or if 24h passed
    return now.getTime() - last.getTime() > 24 * 60 * 60 * 1000;
  }, [game.lastClaimDate, game.isLoaded]);

  const handleOpen = () => {
    if (!canClaim) return;
    setOpening(true);

    // Artificial delay for tension
    setTimeout(() => {
      const res = game.claimDaily();
      setReward(res);
      setOpening(false);
    }, 2000);
  };

  if (!game.isLoaded) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center text-center pt-8">
      <div className="relative mb-12">
        <div className={`text-9xl transition-transform duration-500 scale-125 ${opening ? 'animate-shake' : 'animate-float'}`}>
          {game.getBoxTypeForStreak(game.streak + 1) === "basic" ? "📦" :
            game.getBoxTypeForStreak(game.streak + 1) === "silver" ? "🥈" :
              game.getBoxTypeForStreak(game.streak + 1) === "gold" ? "🥇" : "💎"}
        </div>
        <div className="absolute inset-0 bg-[#5c7cff] blur-[100px] opacity-20 -z-10" />
      </div>

      <h2 className="text-2xl font-black mb-2 uppercase tracking-wide">
        {canClaim ? "Ready to Open!" : "Box Claimed"}
      </h2>
      <p className="text-white/50 text-xs mb-8 uppercase tracking-widest font-bold">
        {game.getBoxTypeForStreak(game.streak + 1)} Box Waiting
      </p>

      <button
        onClick={handleOpen}
        disabled={!canClaim || opening}
        className={`w-full max-w-[280px] py-5 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${canClaim && !opening
          ? 'bg-gradient-to-r from-[#5c7cff] to-[#ff5c7c] shadow-[0_0_30px_rgba(92,124,255,0.4)] active:scale-95'
          : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
          }`}
      >
        {opening ? "Opening..." : canClaim ? "Claim Box" : "Claimed Today"}
      </button>

      {reward && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="text-8xl mb-6 animate-bounce">
            {reward.type === 'coins' ? '🪙' : reward.type === 'skin' ? '👕' : reward.type === 'avatar' ? '👤' : '🎁'}
          </div>
          <h3 className="text-white/60 text-sm uppercase font-black mb-1">You Found</h3>
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {reward.name}
          </h1>
          <div className={`px-4 py-1 rounded-full text-[10px] uppercase font-black mb-12 border ${reward.rarity === 'legendary' ? 'border-[#eab308] text-[#eab308] shadow-[0_0_15px_rgba(234,179,8,0.3)]' :
            reward.rarity === 'epic' ? 'border-[#a855f7] text-[#a855f7]' :
              reward.rarity === 'rare' ? 'border-[#3b82f6] text-[#3b82f6]' :
                'border-white/20 text-white/40'
            }`}>
            {reward.rarity}
          </div>
          <button
            onClick={() => setReward(null)}
            className="w-full max-w-[200px] py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest"
          >
            Awesome
          </button>
        </div>
      )}
    </div>
  );
}

function InventoryView({ game }: { game: any }) {
  return (
    <div className="pb-12">
      <h2 className="text-2xl font-black mb-6 uppercase tracking-wider">Inventory</h2>
      <div className="grid grid-cols-2 gap-4">
        {game.inventory.length === 0 ? (
          <div className="col-span-2 py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
            <p className="text-white/20 font-bold uppercase tracking-widest">Nothing yet...</p>
          </div>
        ) : (
          game.inventory.slice().reverse().map((item: any, i: number) => (
            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="text-4xl mb-3">{item.type === 'coins' ? '🪙' : item.type === 'skin' ? '👕' : item.type === 'avatar' ? '👤' : '🎁'}</div>
              <p className="text-sm font-bold truncate">{item.name}</p>
              <p className="text-[10px] text-white/40 uppercase font-bold">{item.rarity}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ShopView({ game }: { game: any }) {
  return (
    <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
      <h2 className="text-2xl font-black mb-2 uppercase tracking-wider">Shop</h2>
      <p className="text-white/20 font-bold uppercase tracking-widest">Opening Soon</p>
    </div>
  );
}

function QuestsView({ game }: { game: any }) {
  return (
    <div className="pb-12">
      <h2 className="text-2xl font-black mb-6 uppercase tracking-wider">Daily Quests</h2>
      <div className="space-y-4">
        <QuestItem title="Daily Claim" progress={game.lastClaimDate ? 1 : 0} total={1} reward="Variable" />
        <QuestItem title="Streak Master" progress={game.streak} total={7} reward="Silver Box" />
      </div>
    </div>
  );
}

function QuestItem({ title, progress, total, reward }: { title: string, progress: number, total: number, reward: string }) {
  const percent = Math.min(100, (progress / total) * 100);
  return (
    <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-white/90">{title}</h3>
          <p className="text-xs text-[#7cff5c] font-black uppercase tracking-tighter">Reward: {reward}</p>
        </div>
        <span className="text-xs font-mono font-bold text-white/40">{progress}/{total}</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-[#5c7cff]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function LeaderboardView({ game }: { game: any }) {
  return (
    <div className="pb-12">
      <h2 className="text-2xl font-black mb-6 uppercase tracking-wider">Leaderboard</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#5c7cff]/10 border border-[#5c7cff]/20">
          <span className="text-xl font-black italic text-[#5c7cff]">1</span>
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/5 overflow-hidden flex items-center justify-center">
            👤
          </div>
          <div className="flex-1">
            <p className="font-bold">You</p>
            <p className="text-xs text-white/40">{game.streak} streak</p>
          </div>
          <span className="text-[#eab308] font-black">🪙 {game.coins}</span>
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50 grayscale">
            <span className="text-xl font-black italic text-white/20">{i + 1}</span>
            <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
              👤
            </div>
            <div className="flex-1">
              <p className="font-bold text-white/40">Player_{i}82</p>
              <p className="text-xs text-white/20">0 streak</p>
            </div>
            <span className="text-white/20 font-black">🪙 0</span>
          </div>
        ))}
      </div>
    </div>
  );
}
