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

  export function checkRotaGameWinner(circleArray: string[]): [boolean, string] {
    console.log("Here");
    
    // Straight wins
    if (circleArray[0] !== "false" && circleArray[0] === circleArray[8] && circleArray[8] === circleArray[4]){
      return [true, circleArray[0]];
    }else if (circleArray[1] !== "false" && circleArray[1] === circleArray[8] && circleArray[8] === circleArray[5]){
      return [true, circleArray[1]];
    }else if (circleArray[2] !== "false" && circleArray[2] === circleArray[8] && circleArray[8] === circleArray[6]){
      return [true, circleArray[2]];
    }else  if (circleArray[3] !== "false" && circleArray[3] === circleArray[8] && circleArray[8] === circleArray[7]){
      return [true, circleArray[3]];
    }

    // Around wins
    if (circleArray[0] !== "false" && circleArray[0] === circleArray[1] && circleArray[1] === circleArray[2]){
      return [true, circleArray[0]];
    }else  if (circleArray[1] !== "false" && circleArray[1] === circleArray[2] && circleArray[2] === circleArray[3]){
      return [true, circleArray[1]];
    }else  if (circleArray[2] !== "false" && circleArray[2] === circleArray[3] && circleArray[3] === circleArray[4]){
      return [true, circleArray[2]];
    }else  if (circleArray[3] !== "false" && circleArray[3] === circleArray[4] && circleArray[4] === circleArray[5]){
      return [true, circleArray[3]];
    }else  if (circleArray[4] !== "false" && circleArray[4] === circleArray[5] && circleArray[5] === circleArray[6]){
      return [true, circleArray[4]];
    }else  if (circleArray[5] !== "false" && circleArray[5] === circleArray[6] && circleArray[6] === circleArray[7]){
      return [true, circleArray[5]];
    }else  if (circleArray[6] !== "false" && circleArray[6] === circleArray[7] && circleArray[7] === circleArray[0]){
      return [true, circleArray[6]];
    }else  if (circleArray[7] !== "false" && circleArray[7] === circleArray[0] && circleArray[0] === circleArray[1]){
      return [true, circleArray[7]];
    }

    return [false, ""];
  }