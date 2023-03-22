import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

export interface Snake {
  posX: number;
  posY: number;
}

export interface Apple {
  posX: number;
  posY: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  field!: ElementRef<HTMLCanvasElement>;
  
  public gameScore: number = 0;

  public posX: number = 15;
  public posY: number = 15;

  public snakeArr: Snake[] = [
    {posX: this.posX - 3, posY: this.posY},
    {posX: this.posX - 2, posY: this.posY},
    {posX: this.posX - 1, posY: this.posY},
    {posX: this.posX, posY: this.posY}
  ];

  public applesArr: Apple[] = [];

  public moveVecX: number = 1;
  public moveVecY: number = 0;

  public ctx: any;
  public isDeadFlag = false;

  @HostListener('document:keydown', ['$event'])
  public keyDown(event: KeyboardEvent) {
    this.changeMoveVec(event);
  }

  constructor() { 
    console.log(' this is snake ', this.snakeArr);
  }

  ngOnInit(): void {
    this.ctx = this.field.nativeElement.getContext('2d');

    this.gameLoop();
    this.appleLoop();
  }

  public drawField(): void {
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, 500, 500);
  }

  public gameLoop(): void {
    if (!this.isDeadFlag) {
      this.drawField();
      this.renderApples();
      this.drawSnake();
      
      this.checkIsEat();
      this.checkIsSnake();
      this.checkInField();
      this.moveSnake();
      this.renderSnake();
      
      setTimeout(() => {
        this.gameLoop();
      }, 100);
    }
  }

  public appleLoop(): void {
    if (!this.isDeadFlag) {
      this.generateApple();
      setTimeout(() => {
        this.appleLoop();
      }, 3000);
    }
  }

  public moveSnake(): void {
    this.posX += this.moveVecX;
    this.posY += this.moveVecY;
  }

  public renderSnake(): void {
    for (let i = 0; i < this.snakeArr.length - 1; i++) {
      this.snakeArr[i].posX = this.snakeArr[i + 1].posX;
      this.snakeArr[i].posY = this.snakeArr[i + 1].posY;
    }

    this.snakeArr[this.snakeArr.length - 1].posX = this.posX;
    this.snakeArr[this.snakeArr.length - 1].posY = this.posY;
  }

  public drawSnake(): void {
    for (let cell of this.snakeArr) {
      this.ctx.fillStyle = 'rgb(0, 255, 0)';
      this.ctx.fillRect(cell.posX * 20, cell.posY * 20, 20, 20,);
    }
  }

  public changeMoveVec(key: any): void {
    console.log(key);
    if (key.code === 'ArrowLeft' && this.posX !== 0 && this.moveVecX !== 1) {
      this.moveVecX = -1;
      this.moveVecY = 0;
    }

    if (key.code === 'ArrowRight' && this.posX !== 24 && this.moveVecX !== -1) {
      this.moveVecX = 1;
      this.moveVecY = 0;
    }

    if (key.code === 'ArrowUp' && this.posY !== 0 && this.moveVecY !== 1) {
      this.moveVecX = 0;
      this.moveVecY = -1;
    }

    if (key.code === 'ArrowDown' && this.posY !== 24 && this.moveVecY !== -1) {
      this.moveVecX = 0;
      this.moveVecY = 1;
    }

    if (key.code === 'Space') {
      this.addCell();
    }
  }

  public addCell(): void {
    this.snakeArr.unshift({posX: this.snakeArr[0].posX, posY: this.snakeArr[0].posY});
    this.gameScore++;
  }

  public generateApple(): void {
    let applePosX: number = Math.floor(Math.random() * 26);
    let applePosY: number = Math.floor(Math.random() * 26);

    this.applesArr.push({posX: applePosX * 20, posY: applePosY * 20});

  }

  public renderApples(): void {
    for (let apple of this.applesArr) {
      this.ctx.fillStyle = 'rgb(255, 0, 0)';
      this.ctx.fillRect(apple.posX, apple.posY, 20, 20);
    }
  }

  public checkIsEat(): void {
    for (let i = 0; i < this.applesArr.length; i++) {
      if (this.posX * 20 === this.applesArr[i].posX && this.posY * 20 === this.applesArr[i].posY) {
        this.applesArr.splice(i, 1);
        this.addCell();
        break;
      }
    }
  }

  public checkIsSnake(): void {
    for (let i = 0; i < this.snakeArr.length - 2; i++) {
      if (this.posX * 20 === this.snakeArr[i].posX * 20 && this.posY * 20 === this.snakeArr[i].posY * 20) {
        this.isDeadFlag = true;
        console.log('dead');
      }
    }
  }

  public checkInField(): void {
    if (this.posX === 25 || this.posX === -1 || this.posY === -1 || this.posY === 25) {
      this.isDeadFlag = true;
    }
  }

  public restartGame(): void {
    location.reload();
  }

}
