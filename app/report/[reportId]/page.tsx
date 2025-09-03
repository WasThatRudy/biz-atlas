import { mockReports } from '@/lib/mock-data';
import { ReportView } from '@/components/report-view';

export async function generateStaticParams() {
  // Include all mock report IDs plus the hardcoded one from the analysis flow
  const reportIds = mockReports.map((report) => ({
    reportId: report.id,
  }));
  
  // Add the hardcoded report ID that gets generated from the analysis flow
  reportIds.push({ reportId: 'newly-generated-report-123' });
  
  return reportIds;
}

interface ReportPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { reportId } = await params;
  return <ReportView reportId={reportId} />;
}