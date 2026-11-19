import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, Sparkles, Building2 } from 'lucide-react';
import api from '../../services/api';

export default function StatsStrip() {
  const [stats, setStats] = useState(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        const res = await api.get('/orders/admin/all').catch(() => null);
        if (res && res.data && res.data.success && res.data.count > 0) {
          const orders = res.data.orders;
          const completed = orders.filter(o => o.orderStatus === 'Delivered').length;
          const active = orders.filter(o => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Delivered').length;
          
          setStats({
            totalOrders: orders.length,
            completedOrders: completed,
            activeCare: active,
          });
          setHasData(true);
        } else {
          // Check public services count
          const sRes = await api.get('/services').catch(() => null);
          if (sRes && sRes.data && sRes.data.count > 0) {
            setStats({
              servicesCount: sRes.data.count,
              locationCount: 1, // Ghumar Mandi
              careStandards: 10 // 10-point inspection
            });
            setHasData(true);
          }
        }
      } catch (err) {
        setHasData(false);
      }
    };
    fetchRealStats();
  }, []);

  if (!hasData || !stats) {
    return null; // Gracefully hidden if no real DB data exists
  }

  return (
    <section className="py-12 bg-mercury-navy text-white relative overflow-hidden border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          <div className="pt-4 md:pt-0">
            <span className="block font-serif text-3xl sm:text-4xl font-bold text-white mb-1">
              {stats.totalOrders || stats.servicesCount || 7}
            </span>
            <p className="text-xs text-blue-200 tracking-wider uppercase font-medium">
              {stats.totalOrders ? 'Orders Handled' : 'Care Services'}
            </p>
          </div>

          <div className="pt-4 md:pt-0">
            <span className="block font-serif text-3xl sm:text-4xl font-bold text-amber-400 mb-1">
              {stats.completedOrders || '100%'}
            </span>
            <p className="text-xs text-blue-200 tracking-wider uppercase font-medium">
              {stats.completedOrders ? 'Completed Deliveries' : 'Fabric Safe Guarantee'}
            </p>
          </div>

          <div className="pt-4 md:pt-0">
            <span className="block font-serif text-3xl sm:text-4xl font-bold text-sky-400 mb-1">
              {stats.activeCare || '48h'}
            </span>
            <p className="text-xs text-blue-200 tracking-wider uppercase font-medium">
              {stats.activeCare ? 'Orders in Master Care' : 'Standard Turnaround'}
            </p>
          </div>

          <div className="pt-4 md:pt-0">
            <span className="block font-serif text-3xl sm:text-4xl font-bold text-emerald-400 mb-1">
              Ghumar Mandi
            </span>
            <p className="text-xs text-blue-200 tracking-wider uppercase font-medium">
              Flagship Workshop
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
