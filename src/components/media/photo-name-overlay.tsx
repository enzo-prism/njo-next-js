type PhotoNameOverlayProps = {
  names?: readonly string[];
  className?: string;
};

export function PhotoNameOverlay({ names, className }: PhotoNameOverlayProps) {
  // Name bars are intentionally not rendered. Some labels have not
  // matched the photos, so images stand on their own.
  void names;
  void className;
  return null;
}
