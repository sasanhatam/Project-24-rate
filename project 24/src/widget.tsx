import React from 'react';
import ReactDOM from 'react-dom/client';
import { Asset } from '@/types';
import { fetchAssets } from '@/lib/api';
import { AssetCard } from '@/components/dashboard/AssetCard';
import { AssetTable } from '@/components/dashboard/AssetTable';
import './index.css';

function WidgetApp() {
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [favorites, setFavorites] = React.useState<string[]>([]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');

    if (mode === 'widget') {
      loadWidgetData();
    }
  }, []);

  const loadWidgetData = async () => {
    try {
      const data = await fetchAssets();
      setAssets(data);
    } catch (error) {
      console.error('Failed to load widget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'grid';
  const assetsParam = params.get('assets')?.split(',') || [];
  const theme = params.get('theme') || 'light';

  const filteredAssets = assets.filter(a => assetsParam.includes(a.id));

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-slate-500 text-sm">درحال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className={`p-4 font-vazir ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {type === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map(asset => (
            <AssetCard
              key={asset.id}
              asset={asset}
              isFavorite={favorites.includes(asset.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : type === 'table' ? (
        <AssetTable
          assets={filteredAssets}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filteredAssets.map(asset => (
            <div key={asset.id} className="flex-shrink-0 px-3 py-2 bg-slate-100 rounded-lg text-sm whitespace-nowrap">
              <div className="font-bold">{asset.nameFa}</div>
              <div className="text-xs text-slate-600">{asset.priceToman.toLocaleString('fa-IR')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <WidgetApp />
  </React.StrictMode>
);
