import React, { useState, useEffect } from 'react';
import { Image, ImageSourcePropType } from 'react-native';

type NutriScoreVariant = 'A' | 'B' | 'C' | 'D' | 'E';
type EcoScoreVariant = 'A' | 'B' | 'C' | 'D' | 'E';
type NovaScoreVariant = 1 | 2 | 3 | 4;

interface ScoreImageProps {
  type: 'nutriscore' | 'ecoscore' | 'novascore';
  variant: NutriScoreVariant | EcoScoreVariant | NovaScoreVariant;
}

// Static image mappings - React Native requires static require() paths
const NUTRISCORE_IMAGES: Record<NutriScoreVariant, any> = {
  A: require('../../assets/scores/nutriscore/nutriscore-a.png'),
  B: require('../../assets/scores/nutriscore/nutriscore-b.png'),
  C: require('../../assets/scores/nutriscore/nutriscore-c.png'),
  D: require('../../assets/scores/nutriscore/nutriscore-d.png'),
  E: require('../../assets/scores/nutriscore/nutriscore-e.png'),
};

const ECOSCORE_IMAGES: Record<EcoScoreVariant, any> = {
  A: require('../../assets/scores/ecoscore/ecoscore-a.png'),
  B: require('../../assets/scores/ecoscore/ecoscore-b.png'),
  C: require('../../assets/scores/ecoscore/ecoscore-c.png'),
  D: require('../../assets/scores/ecoscore/ecoscore-d.png'),
  E: require('../../assets/scores/ecoscore/ecoscore-e.png'),
};

const NOVASCORE_IMAGES: Record<NovaScoreVariant, any> = {
  1: require('../../assets/scores/novascore/novascore-1.png'),
  2: require('../../assets/scores/novascore/novascore-2.png'),
  3: require('../../assets/scores/novascore/novascore-3.png'),
  4: require('../../assets/scores/novascore/novascore-4.png'),
};

export function ScoreImage({ type, variant }: ScoreImageProps) {
  const [imageWidth, setImageWidth] = useState<number | undefined>(undefined);
  const FIXED_HEIGHT = 56; // h-16 = 64px

  let imageSource: ImageSourcePropType;

  if (type === 'nutriscore') {
    imageSource = NUTRISCORE_IMAGES[variant as NutriScoreVariant];
  } else if (type === 'ecoscore') {
    imageSource = ECOSCORE_IMAGES[variant as EcoScoreVariant];
  } else {
    imageSource = NOVASCORE_IMAGES[variant as NovaScoreVariant];
  }

  useEffect(() => {
    // Get image dimensions using resolveAssetSource
    const resolvedSource = Image.resolveAssetSource(imageSource);
    if (resolvedSource && resolvedSource.width && resolvedSource.height) {
      const aspectRatio = resolvedSource.width / resolvedSource.height;
      setImageWidth(FIXED_HEIGHT * aspectRatio);
    }
  }, [imageSource]);

  return (
    <Image
      source={imageSource}
      style={{ width: imageWidth, height: FIXED_HEIGHT }}
      resizeMode="contain"
    />
  );
}
