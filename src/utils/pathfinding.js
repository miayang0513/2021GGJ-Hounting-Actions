import EasyStar from 'easystarjs'

export default class PathFinding {

    constructor(Player) {
        this.Finder = new EasyStar.js()
        this.Player = Player
        this.tiles = []
        this.grid = []
    }

    init(_tiles) {
        var GridRight = 0
        var GridBottom = 0

        this.tiles = _tiles

        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles.length; j++) {
                const element = this.tiles[j]
                GridRight = (element.coordinateX > GridRight) ? element.coordinateX : GridRight
                GridBottom = (element.coordinateX > GridBottom) ? element.coordinateX : GridBottom
            }
        }
        var _grid = []
        _grid.length = GridRight + 1
        for (let i = 0; i < _grid.length; i++) {
            _grid[i] = []
            _grid[i].length = GridBottom + 1
        }
        for (let index = 0; index < this.tiles.length; index++) {
            const element = this.tiles[index]
            if (element.acceptable == false) {
                _grid[element.coordinateY][element.coordinateX] = 1
                continue
            }
            _grid[element.coordinateY][element.coordinateX] = 0
        }
        this.grid = _grid
        this.Finder.setGrid(_grid)
        this.Finder.setAcceptableTiles([0])
    }

    //新增可以觸及的範圍，並更新網格
    //這邊也可以同時新增，如果碰觸到網格要觸發的事件(ch-oncomplete)
    addTile(addTile = [{ tile, x, y, floor, callback }]) {
        console.log("Before")
        console.log(this.grid)
        for (let i = 0; i < addTile.length; i++) {
            const element = addTile[i];
            // element.tile.setDot()
            element.tile.floor = 2
            this.Player.tileEvent.push(element)
            this.tiles.push(element.tile)
        }
        this.init(this.tiles)
        console.log("After")
        console.log(this.grid)
    }

    ClearPathHint(tiles = this.tiles) {
        for (let t = 0; t < tiles.length; t++) {
            var element = tiles[t]
            element.clearIndicator()
        }
    }

    Find(Tile, comfirm, tiles = this.tiles) {
        if (this.Player.state != 'idle') return
        if (this.Player.floor.pathfinder != this) return
        this.ClearPathHint()
        console.log(this.Player.coordinateX + "/" + this.Player.coordinateY)
        this.Finder.findPath(this.Player.coordinateX, this.Player.coordinateY, Tile.coordinateX, Tile.coordinateY,
            function (path) {
                if (path === null) {
                    return
                }
                const tilePath = []
                for (let p = 0; p < path.length; p++) {
                    const { x, y } = path[p]
                    const tile = tiles.find(t => t.coordinateX == x && t.coordinateY == y)
                    console.log("Path" + p + "/x:" + x + "  y:" + y)
                    if (p === path.length - 1 && tile.hasOwnProperty('item')) {
                        continue
                    } else {
                        // grid on middle path
                        tile.setDot()
                    }
                    tilePath[p] = tile
                }
                tilePath[tilePath.length - 1].setBorderRec()
                comfirm(tilePath)
            })
    }
}