import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StateCardProps {
  title: string;
  icon: React.ReactElement;
  description: string;
  value: number | string | boolean;
  badge_text?: string;
}

const StateCard = ({
  title,
  icon,
  description,
  value,
  badge_text,
}: StateCardProps) => {
  let footer_content = <></>;
  if (badge_text) {
    footer_content = (
      <CardFooter>
        <Badge>Virtual</Badge>
      </CardFooter>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          {icon}
          <p>{title}</p>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex items-center'>
        <p>{value}</p>
      </CardContent>
      {footer_content}
    </Card>
  );
};

export default StateCard;
