import { Card } from '@/components/ui/Card';
import type { Assessment } from '@/types/product';

interface AssessmentCardProps {
  assessment: Assessment;
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  return (
    <Card>
      <h2 className='text-xl font-semibold text-gray-90 mb-4'>Nutritional Assessment</h2>
      <div className='flex items-center gap-4'>
        <div className='w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white' style={{ backgroundColor: assessment.color }}>
          {assessment.category}
        </div>
        <div className='flex-1'>
          <div className='flex items-baseline gap-2'>
            <span className='text-2xl font-semibold text-gray-90'>{assessment.score}/100</span>
            <span className='text-gray-60'>points</span>
          </div>
          <p className='mt-2 text-gray-70'>{assessment.description}</p>
        </div>
      </div>
    </Card>
  );
}
