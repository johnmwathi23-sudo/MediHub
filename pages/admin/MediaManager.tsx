import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { Upload, Trash, Copy, Check, ImageIcon, Star, RefreshCw } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

type SiteImage = {
  name: string;
  url: string;
  updated_at: string;
};

type SiteSetting = {
  key: string;
  value: string;
};

export const MediaManager: React.FC = () => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [replacing, setReplacing] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { supabase } = await import('../../services/supabase');
      const s = supabase!;

      const [imgResult, settingsResult] = await Promise.all([
        s.storage.from('site-assets').list(),
        s.from('site_settings').select('*'),
      ]);

      if (imgResult.error) throw imgResult.error;
      if (settingsResult.error) throw settingsResult.error;

      const siteImages: SiteImage[] = (imgResult.data || [])
        .filter(f => f.name && !f.name.startsWith('.'))
        .map(f => ({
          name: f.name,
          url: `${SUPABASE_URL}/storage/v1/object/public/site-assets/${f.name}`,
          updated_at: f.updated_at || f.created_at || '',
        }));

      setImages(siteImages);

      const settingsMap: Record<string, string> = {};
      (settingsResult.data as SiteSetting[] || []).forEach(s => {
        settingsMap[s.key] = s.value;
      });
      setSettings(settingsMap);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load media library' });
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);
    const { supabase } = await import('../../services/supabase');
    const s = supabase!;

    let successCount = 0;
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name}`;
      const { error } = await s.storage.from('site-assets').upload(path, file);
      if (!error) successCount++;
    }

    if (successCount > 0) {
      setMessage({ type: 'success', text: `${successCount} image(s) uploaded` });
      loadData();
    } else {
      setMessage({ type: 'error', text: 'Upload failed' });
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setMessage(null);
    const { supabase } = await import('../../services/supabase');
    const s = supabase!;

    const { error } = await s.storage.from('site-assets').remove([name]);
    if (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
      return;
    }

    // Clear any settings using this image
    const affected = Object.entries(settings).filter(([, v]) => v === name);
    for (const [key] of affected) {
      await s.from('site_settings').upsert({ key, value: '' }, { onConflict: 'key' });
    }

    setMessage({ type: 'success', text: 'Image deleted' });
    loadData();
  };

  const handleReplace = async (name: string, file: File) => {
    setReplacing(name);
    setMessage(null);
    const { supabase } = await import('../../services/supabase');
    const s = supabase!;

    const { error } = await s.storage.from('site-assets').update(name, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      setMessage({ type: 'error', text: `Failed to replace "${name}"` });
    } else {
      setMessage({ type: 'success', text: `"${name}" replaced` });
      loadData();
    }
    setReplacing(null);
  };

  const handleCopyUrl = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setMessage({ type: 'error', text: 'Failed to copy URL' });
    }
  };

  const setBanner = async (key: string, value: string) => {
    setMessage(null);
    const { supabase } = await import('../../services/supabase');
    const s = supabase!;

    const newValue = settings[key] === value ? '' : value;
    const { error } = await s.from('site_settings').upsert({ key, value: newValue }, { onConflict: 'key' });

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update setting' });
      return;
    }

    setSettings(prev => ({ ...prev, [key]: newValue }));
    setMessage({ type: 'success', text: newValue ? 'Banner updated' : 'Banner removed' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Media Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage site banners and images</p>
        </div>
        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-medical-600 text-white text-sm font-medium rounded-md hover:bg-medical-700 focus:outline-none">
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input type="file" className="hidden" multiple accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-md text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading media library...</div>
      ) : (
        <>
          {images.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No images yet</p>
              <p className="text-gray-400 text-sm mt-1">Upload images to use as site banners</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img, index) => {
                const isHero = settings.hero_image === img.name;
                const isAbout = settings.about_image === img.name;

                return (
                  <div key={img.name} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                    <div className="aspect-video bg-gray-100 relative">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 flex space-x-1">
                        {isHero && (
                          <span className="bg-medical-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center">
                            <Star className="h-2.5 w-2.5 mr-0.5 fill-current" /> Hero
                          </span>
                        )}
                        {isAbout && (
                          <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center">
                            <Star className="h-2.5 w-2.5 mr-0.5 fill-current" /> About
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 group-focus-within:bg-opacity-40 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
                        <label className="bg-white text-blue-600 p-1.5 rounded-full shadow hover:bg-gray-100 cursor-pointer" title="Replace">
                          {replacing === img.name ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={e => {
                              if (e.target.files?.[0]) handleReplace(img.name, e.target.files[0]);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <button
                          onClick={() => handleCopyUrl(img.url, index)}
                          className="bg-white text-gray-700 p-1.5 rounded-full shadow hover:bg-gray-100"
                          title="Copy URL"
                        >
                          {copiedIndex === index ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(img.name)}
                          className="bg-white text-red-600 p-1.5 rounded-full shadow hover:bg-gray-100"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2 space-y-1.5">
                      <p className="text-xs text-gray-900 truncate font-medium">{img.name}</p>
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => setBanner('hero_image', img.name)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                            isHero ? 'bg-medical-100 text-medical-700' : 'bg-gray-100 text-gray-500 hover:bg-medical-50 hover:text-medical-600'
                          }`}
                        >
                          {isHero ? 'Hero ✓' : 'Set as Hero'}
                        </button>
                        <button
                          onClick={() => setBanner('about_image', img.name)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                            isAbout ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500 hover:bg-purple-50 hover:text-purple-600'
                          }`}
                        >
                          {isAbout ? 'About ✓' : 'Set as About'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
