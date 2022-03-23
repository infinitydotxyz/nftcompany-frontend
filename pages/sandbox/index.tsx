import Chip from 'components/base/Chip/Chip';
import RoundedNav from 'components/base/RoundedNav/RoundedNav';
import { FaFacebook, FaTwitter } from 'react-icons/fa';

export default function SandBox() {
  return (
    <div className="flex-col space-y-8 prose p-4">
      <h1>Button</h1>
      <div className="flex space-x-4">
        <button className="btn">Button 1</button>
        <button className="btn">Button 2</button>
      </div>

      <h1>Chip</h1>
      <div className="flex">
        <Chip content="Watch" />
        <Chip content="Edit" />
        <Chip content={<FaTwitter />} />
        <Chip content={<FaFacebook />} />
      </div>

      <h1>RoundedNav</h1>
      <div className="w-1/6">
        <RoundedNav
          items={[{ title: 'NFT' }, { title: 'Community' }]}
          onChange={(currentIndex) => {
            // setCurrentTab(currentIndex)
          }}
        />
      </div>
    </div>
  );
}
