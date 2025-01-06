import React from 'react';
import StationaryForm from './StationaryCombustion/StationaryForm';
import MobileForm from './MobileCombustion/MobileForm';
import FugitiveForm from './FugitiveEmissions/FugitiveForm';

const Page3Layout = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const scope = queryParams.get('scope');

  return (
    <div>
      {scope === 'stationary' && <StationaryForm />}
      {scope === 'mobile' && <MobileForm />}
      {scope === 'fugitive' && <FugitiveForm />}
    </div>
  );
};

export default Page3Layout;
