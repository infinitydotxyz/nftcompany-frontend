import IconWithText from 'components/IconWithText/IconWithText';
import { FiCheck } from 'react-icons/fi';

interface CollectionBenefitsProps {
  benefits: string[];
}

function CollectionBenefits(props: CollectionBenefitsProps) {
  return (
    <>
      {props.benefits.map((benefit) => (
        <IconWithText key={benefit} text={benefit} icon={<FiCheck />} />
      ))}
    </>
  );
}
export default CollectionBenefits;
