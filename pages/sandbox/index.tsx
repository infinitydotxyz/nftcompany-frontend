import Chip from 'components/base/Chip/Chip';
import RoundedNav from 'components/base/RoundedNav/RoundedNav';
import { FaFacebook, FaTwitter } from 'react-icons/fa';

export default function SandBox() {
  return (
    <div className="flex-col space-y-8 prose p-4">
      <h3># Text</h3>
      <div>
        <h1 className="page-header">Page Header</h1>
        <h1>H1</h1>
        <h2>H2</h2>
        <h3>H3</h3>
        <h4>H4</h4>
        <h5>H5</h5>
        <h6>H6</h6>
        <div className="text-primary">Primary Text</div>
        <div className="text-secondary">Secondary Text</div>
      </div>

      <h3># Button</h3>
      <div className="flex space-x-4">
        <button className="btn">Button 1</button>
        <button className="btn">Button 2</button>
      </div>

      <h3># Chip</h3>
      <div className="flex">
        <Chip content="Watch" />
        <Chip content="Edit" />
        <Chip content={<FaTwitter />} />
        <Chip content={<FaFacebook />} />
      </div>

      <h3># RoundedNav</h3>
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
