'use client';

/**
 * Export Dashboard Page
 * Displays the Export Center component for exporting articles and analytics
 */

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ExportCenter from '@/components/ExportCenter';

function ExportPageContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') as 'articles' | 'analytics' | 'bulk' | null;

  return (
    <div className="p-8">
      <ExportCenter defaultTab={tab || 'articles'} />
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ExportPageContent />
    </Suspense>
  );
}
