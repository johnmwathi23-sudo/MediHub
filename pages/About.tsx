import React, { useEffect, useState } from 'react';
import { Target, Users, Award, ShieldCheck } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const About: React.FC = () => {
    const [aboutImage, setAboutImage] = useState('');
    const [aboutLoaded, setAboutLoaded] = useState(false);

    useEffect(() => {
        const cached = sessionStorage.getItem('medihub_about');
        if (cached) {
            setAboutImage(cached);
        }

        const loadImage = async () => {
            try {
                const { supabase } = await import('../services/supabase');
                const s = supabase!;
                const { data } = await s.from('site_settings').select('value').eq('key', 'about_image').single();
                if (data?.value) {
                    const url = `${SUPABASE_URL}/storage/v1/object/public/site-assets/${data.value}`;
                    setAboutImage(url);
                    sessionStorage.setItem('medihub_about', url);
                }
            } catch {}
        };
        loadImage();
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-medical-50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="lg:w-1/2">
                            <h1 className="text-4xl font-extrabold text-medical-900 sm:text-5xl tracking-tight">
                                Delivering Health with <span className="text-medical-600">MediHub</span>
                            </h1>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500">
                                As Kenya's leading supplier of advanced medical equipment, we act as the critical link between
                                world-class biomedical technology and local healthcare providers.
                            </p>
                        </div>
                        <div className="mt-10 lg:mt-0 lg:w-1/2 lg:pl-10 bg-gray-200 rounded-2xl">
                            {aboutImage && (
                                <img
                                    className={`rounded-2xl shadow-xl w-full object-cover h-56 sm:h-80 lg:h-96 border-4 border-white transition-opacity duration-500 ${aboutLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    src={aboutImage}
                                    alt="MediHub Medical Team"
                                    onLoad={() => setAboutLoaded(true)}
                                    onError={() => { setAboutImage(''); setAboutLoaded(false); }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="py-16 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div className="bg-medical-50 p-8 rounded-2xl shadow-sm border border-medical-100 flex flex-col justify-center">
                            <Target className="h-10 w-10 text-medical-600 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To elevate healthcare standards across Kenya and East Africa by providing reliable,
                                affordable, and high-quality medical equipment. We believe that every hospital, clinic,
                                and patient deserves access to life-saving diagnostic tools.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <Award className="h-10 w-10 text-medical-600 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To be the most trusted and comprehensive healthcare supply chain partner in Africa. We aim
                                to build a resilient health infrastructure network through technology, innovation, and
                                unparalleled biomedical engineering support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900">Why Healthcare Professionals Trust Us</h2>
                        <p className="mt-4 text-lg text-gray-500">
                            From small regional clinics to major referral hospitals, MediHub is dedicated to excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="flex justify-center mb-4">
                                <div className="bg-medical-100 p-4 rounded-full">
                                    <ShieldCheck className="h-8 w-8 text-medical-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assurance</h3>
                            <p className="text-gray-500">
                                We supply only KEBS-approved, ISO-certified medical equipment sourced directly from
                                reputable global manufacturers.
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-center mb-4">
                                <div className="bg-medical-100 p-4 rounded-full">
                                    <Users className="h-8 w-8 text-medical-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Support</h3>
                            <p className="text-gray-500">
                                Our in-house biomedical engineering team offers full installation, maintenance,
                                and post-warranty service.
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-center mb-4">
                                <div className="bg-medical-100 p-4 rounded-full">
                                    <Target className="h-8 w-8 text-medical-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Nationwide Reach</h3>
                            <p className="text-gray-500">
                                With a robust logistics network, we ensure safe and timely delivery to all 47 counties
                                in Kenya.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-medical-600">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        <span className="block">Ready to upgrade your facilities?</span>
                        <span className="block text-medical-100 text-2xl mt-2">Get in touch with our sales team today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <a href="mailto:info@medihub.africa" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-medical-600 bg-white hover:bg-medical-50">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
