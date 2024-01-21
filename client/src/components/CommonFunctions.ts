export function mapCirclesToNumbers(circle: string): number {
    switch (circle) {
      case "top-left":
        return 0;
      case "top":
        return 1;
      case "top-right":
        return 2;
      case "right":
        return 3;
      case "bottom-right":
        return 4;
      case "bottom":
        return 5;
      case "bottom-left":
        return 6;
      case "left":
        return 7;
      case "center":
        return 8;
      default:
        return -1; // Return -1 for any unrecognized input.
    }
  }