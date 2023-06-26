'use client';

import { LazyMotion, m } from 'framer-motion';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const loadFeatures = () => import('./features.js').then((res) => res.default);

function MotionLazy({ children }) {
  return (
    <LazyMotion strict features={loadFeatures}>
      <m.div style={{ height: '100%' }}> {children} </m.div>
    </LazyMotion>
  );
}

MotionLazy.propTypes = {
  children: PropTypes.node,
};

export default dynamic(() => Promise.resolve(MotionLazy), { ssr: false });
