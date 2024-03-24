import vecs from "./vectors";
import init from "./init";


// function ballHitsWall(data) {
//     let potentialHitPoint, futureHitPos, hitScaler;
//     let ball, wall;

//     ball = data.ball;
//     for (let i=0; i<data.gamemode.nbrOfPlayers; i++) {
//         wall = data.field.walls[i];
//         if (ball.pos.getDistFrom(wall.pos) < ball.sp + ball.r + wall.h / 2) {
//             potentialHitPoint = ball.pos.add(wall.dirToCenter.scale(-ball.r));
//             futureHitPos = potentialHitPoint.add(ball.dir.scale(ball.sp));
//             hitScaler = vecs.segmentsIntersect(potentialHitPoint, futureHitPos, wall.top, wall.bottom);
//             if (hitScaler > 0) {
//                 let ballPath = futureHitPos.sub(potentialHitPoint);
//                 console.log(`mag : ${ballPath.mag}`);
//                 ball.pos = ball.pos.add(ballPath.scale(hitScaler));

//                 let dot = ball.dir.dotProduct(wall.dirToTop);
//                 let a = Math.acos(dot / ball.dir.mag * wall.dirToTop.mag);
//                 ball.dir = ball.dir.rotateAroundZ(2 * a);
//                 return true;
//             }
//         }
//     }
//     return false;
// }

function checkCorner(ball, corner, center) {
    let distToCorner, vecCornerDist, cornerHitPoint = 0;

    distToCorner = corner.sub(ball.pos).mag;
    if (distToCorner > ball.sp && distToCorner > ball.r)
        return false;
    if (distToCorner < ball.r) {
        ball.dir = ball.pos.getDirFrom(center);
        return false;
    }
    vecCornerDist = ball.dir.scale(distToCorner);
    cornerHitPoint = ball.pos.add(vecCornerDist);
    if (cornerHitPoint.getDistFrom(corner) < ball.r) {
        let cornerToHitPointDist = corner.sub(cornerHitPoint).mag;
        let scaler = Math.sqrt(ball.r ** 2 - cornerToHitPointDist ** 2);
        ball.pos = cornerHitPoint.add(ball.dir.scale(-scaler));
        ball.dir = ball.pos.getDirFrom(center);
        return true;
    }
    return false;
}

function ballHitsWallSide (ball, segP1, segP2, perpVec, scaledNormalVec) {
    let potentialHitPoint, futureHitPos, hitScaler;

    potentialHitPoint = ball.pos.sub(scaledNormalVec);
    futureHitPos = potentialHitPoint.add(ball.dir.scale(ball.sp));
    hitScaler = vecs.segmentsIntersect(potentialHitPoint, futureHitPos, segP1, segP2);
    if (hitScaler > 0) {
        let ballPath = futureHitPos.sub(potentialHitPoint);
        ball.pos = ball.pos.add(ballPath.scale(hitScaler));
        let dot = ball.dir.dotProduct(perpVec);
        let a = Math.acos(dot / ball.dir.mag * perpVec.mag);
        ball.dir = ball.dir.rotateAroundZ(2 * a);
        return true;
    }
}

function ballHitsWallV2(data) {
    let ball, wall;

    ball = data.ball;
	for (let wall of data.field.walls) {
        if (ball.pos.getDistFrom(wall.pos) < ball.sp + ball.r + wall.h / 2) {
            if (ballHitsWallSide(ball, wall.top, wall.bottom, wall.dirToTop, wall.dirToCenter.scale(ball.r)) ||
                ballHitsWallSide(ball, wall.top, wall.topBack, wall.dirToCenter.scale(-1), wall.dirToTop.scale(ball.r)) ||
                ballHitsWallSide(ball, wall.bottom, wall.bottomBack, wall.dirToCenter, wall.dirToTop.scale(-ball.r))) {
                return true;
            }
            if (checkCorner(ball, wall.top, wall.pos))
                return true;
            if (checkCorner(ball, wall.bottom, wall.pos))
                return true;
        }
    }
    return false;
}


function ballHitsPaddleSide (paddle, ball, segP1, segP2, scaledNormalVec) {
    let potentialHitPoint, futureHitPos, hitScaler;

    potentialHitPoint = ball.pos.sub(scaledNormalVec);
    futureHitPos = potentialHitPoint.add(ball.dir.scale(ball.sp));
    hitScaler = vecs.segmentsIntersect(potentialHitPoint, futureHitPos, segP1, segP2);
    if (hitScaler > 0) {
        let ballPath = futureHitPos.sub(potentialHitPoint);
        ball.pos = ball.pos.add(ballPath.scale(hitScaler));
        ball.dir = ball.pos.getDirFrom(paddle.pos).normalize();
        return true;
    }
}

function ballHitsPaddle(data) {
    let ball, paddle;

    ball = data.ball;
	for (let player of Object.values(data.players)) {
        paddle = player.paddle;
        if (ball.pos.getDistFrom(paddle.pos) < ball.sp + ball.r + paddle.h / 2) {
            if (ballHitsPaddleSide(paddle, ball, paddle.top, paddle.bottom, paddle.dirToCenter.scale(ball.r)) ||
                ballHitsPaddleSide(paddle, ball, paddle.top, paddle.topBack, paddle.dirToTop.scale(ball.r)) ||
                ballHitsPaddleSide(paddle, ball, paddle.bottom, paddle.bottomBack, paddle.dirToTop.scale(-ball.r))) {
                return true;
            }
            if (checkCorner(ball, paddle.top, paddle.pos))
                return true;
            if (checkCorner(ball, paddle.bottom, paddle.pos))
                return true;
        }
    }
    return false;
}

function updatePaddlesPoints(currPaddle, dir) {
    currPaddle.pos = currPaddle.pos.add(dir);
    currPaddle.top = currPaddle.top.add(dir);
    currPaddle.bottom = currPaddle.bottom.add(dir);
    currPaddle.topBack = currPaddle.topBack.add(dir);
    currPaddle.bottomBack = currPaddle.bottomBack.add(dir);
}

function resetPaddlePoints(paddle) {
    paddle.top = paddle.pos.add(paddle.dirToTop.scale(paddle.h / 2));
    paddle.top = paddle.top.add(paddle.dirToCenter.scale(paddle.w / 2));
    paddle.bottom = paddle.pos.add(paddle.dirToTop.scale(-paddle.h / 2));
    paddle.bottom = paddle.bottom.add(paddle.dirToCenter.scale(paddle.w / 2));
    paddle.topBack = paddle.top.add(paddle.dirToCenter.scale(-paddle.w));
    paddle.bottomBack = paddle.bottom.add(paddle.dirToCenter.scale(-paddle.w));
}

function handleDash(currPaddle) {
    if (currPaddle.dashSp != 0) {
        currPaddle.dashFrameCounter++;
        if (currPaddle.dashFrameCounter == 5) {
            currPaddle.dashSp = 0;
            currPaddle.dashFrameCounter = 0;
        }
    }
}

function updatePaddles(data) {
    let currPaddle = 0;

	for (let player of Object.values(data.players)) {
        currPaddle = player.paddle;
        let dir = 0;
        
        dir = (currPaddle.dashSp != 0) ? currPaddle.dirToTop.scale(currPaddle.dashSp) : currPaddle.dirToTop.scale(currPaddle.currSp);
        updatePaddlesPoints(currPaddle, dir);
        handleDash(currPaddle);

        let vecToStart = currPaddle.pos.sub(currPaddle.startingPos);
        let limitDist = (data.field.goalsSize - currPaddle.h - currPaddle.w) / 2;

        if (vecToStart.mag > limitDist) {
            vecToStart = vecToStart.normalize();
            dir = vecToStart.scale(limitDist);
            currPaddle.pos = currPaddle.startingPos.add(vecToStart.scale(limitDist));
            resetPaddlePoints(currPaddle);
        }
    }
}

function updateBall(data) {
    if (!ballHitsWallV2(data) && !ballHitsPaddle(data)) {
        data.ball.pos = data.ball.pos.add(data.ball.dir.scale(data.ball.sp));
    } else {
        data.ball.sp *= 1.01;
    }
    if (data.ball.pos.getDistFrom(new vecs.Vector(0, 0, 0)) > 100) {
        data.ball.pos = new vecs.Vector(0, 0, 0);
        data.ball.sp = data.ball.startingSp;
    }
}

function endGame(data, winner) {
    // display scores + display winner's name
    console.log("!!!!!!!!!!!!!!!!!!!!!! GAME OVER !!!!!!!!!!!!!!!!!!!");
    console.log(`${winner.accountID} WON !`);
    // send result of the game back to tournament or some place else;
    // stop the interval

    // disconnect everyone ? need to think about this
}

function eliminatePlayer(data, player) {
    // important : send the info to the client to delete the corresponding player,
    // it should be the only required additional exchange since the client
    // receives everything else it needs to display properly the game in each
    // "render" socket emission

    console.log("!!!!!!!!!!!!!!!!!!!!!! ELIMINATED !!!!!!!!!!!!!!!!!!!");
    console.log(`${data.gamemode.nbrOfPlayers}`);
    // get rid of this player in the map of players;
    delete data.players[player.accountID];
    data.field.walls.pop();
    // update the nbrOfPlayers accordingly;
    data.gamemode.nbrOfPlayers--;
    // call init() again to setup the field correctly;
}

function handleScoring(data, player) {
    if (data.gamemode.gameType == 0) {
        for (let otherPlayer of Object.values(data.players)) {
            if (otherPlayer === player)
                continue ;
            otherPlayer.score++;
            if (otherPlayer.score == data.gamemode.nbrOfRounds) {
                endGame(data, otherPlayer);
                return -1;
            }
        }
    } else if (data.gamemode.gameType == 1) {
        player.score--;
        if (player.score == 0) {
            eliminatePlayer(data, player);
            data.ball.pos = new vecs.Vector(0, 0, 0);
            if (data.gamemode.nbrOfPlayers == 1) {
                endGame(data, Object.values(data.players)[0]);
                return -1;
            }
            if (data.gamemode.nbrOfPlayers == 2 && data.field.wallsSize < data.field.goalsSize * 1.5) {
                data.field.wallsSize = data.field.goalsSize * 1.5;
                for (let i=0; i<data.gamemode.nbrOfPlayers; i++) {
                    data.field.walls[i].h = data.field.wallsSize;
                }
            }
            init.initFieldShape(data);
            return 1;
        }
    }
    data.ball.pos = new vecs.Vector(0, 0, 0);
    return 0;
}

function checkForScoring(data) {
    let potentialHitPoint, futureHitPos, hitScaler;
    let ball, wall1, wall2, player;

    ball = data.ball;
    for (let i=0; i<data.gamemode.nbrOfPlayers; i++) {
        wall1 = data.field.walls[i];
        wall2 = data.field.walls[(i + 1) % data.gamemode.nbrOfPlayers];
        player = Object.values(data.players)[(i + 1) % data.gamemode.nbrOfPlayers];
        potentialHitPoint = ball.pos;
        futureHitPos = potentialHitPoint.add(ball.dir.scale(ball.sp));
        hitScaler = vecs.segmentsIntersect(potentialHitPoint, futureHitPos, wall1.top, wall2.bottom);
        if (hitScaler > 0) {
            data.ball.sp = data.ball.startingSp;
            return handleScoring(data, player);
        }
    }
    return false;
}

function updateData(data) {
    updatePaddles(data);
    updateBall(data);
    // wait for all players to be connected;
    // in the mean time, just play the game with no scoring and
    // no eliminations in order to make the waiting more fun.
    // so check if all players are connected.

    // when its the case => set the game ongoing status to true;
    // and set the players position back to the starting position;

    // when data.ongoing is true it will trigger the checking of scoring;
    // when game ends => put the ongoing status of the game back to false;
    let result = checkForScoring(data);
    // console.log(`score update\n`);
    // for (let player of Object.values(data.players)) {
    //     console.log(`${player.accountID} [${player.score}]\n`);
    // }
    return result;
}

export default { checkCorner, 
				 ballHitsWallV2, 
				 ballHitsPaddle,
				 updatePaddlesPoints, 
				 resetPaddlePoints, 
				 handleDash, 
				 updatePaddles, 
				 updateBall, 
				 endGame, 
				 eliminatePlayer, 
				 handleScoring, 
				 checkForScoring, 
				 updateData
				};