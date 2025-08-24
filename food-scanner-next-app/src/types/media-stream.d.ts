interface MediaTrackAdvancedConstraints {
  torch?: boolean;
}

declare global {
  interface MediaTrackConstraintSet {
    advanced?: MediaTrackAdvancedConstraints[];
  }
}
