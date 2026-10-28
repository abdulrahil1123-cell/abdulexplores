import { useEffect, useState } from "react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallAppButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) setInstalled(true);
    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as BIPEvent); };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const onClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    alert(
      ios
        ? "To install ARrentals: tap the Share button in Safari, then choose \"Add to Home Screen\"."
        : "To install ARrentals: open your browser menu (⋮) and choose \"Install app\" or \"Add to Home screen\".",
    );
  };

  return (
    <button onClick={onClick} className="rounded-md border border-accent px-3 py-2 text-sm font-bold text-accent hover:bg-accent hover:text-accent-foreground">
      Download App
    </button>
  );
}
