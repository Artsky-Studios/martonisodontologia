export default class Cactus {
  constructor(ctx, x, y, width, height, image) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
    this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  /*collideWith(sprite) {
    const adjustBy = 1.4;
    if (
      sprite.x < this.x + this.width / adjustBy &&
      sprite.x + sprite.width / adjustBy > this.x &&
      sprite.y < this.y + this.height / adjustBy &&
      sprite.height + sprite.y / adjustBy > this.y
    ) {
      return true;
    } else {
      return false;
    }
  }*/

    collideWith(sprite) {
      const buffer = 8; // Reduz a margem para detectar colisões com mais precisão
      if (
        sprite.x + buffer < this.x + this.width - buffer &&
        sprite.x + sprite.width - buffer > this.x + buffer &&
        sprite.y + buffer < this.y + this.height - buffer &&
        sprite.y + sprite.height - buffer > this.y + buffer
      ) {
        return true;
      }
      return false;
    }
    
}
