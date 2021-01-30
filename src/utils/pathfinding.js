import EasyStar from 'easystarjs'

export default class PathFinding {

    constructor(Player) {
        this.Finder = new EasyStar.js()
        this.Player = Player
        this.tiles = []
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

        console.log(_grid)
        this.Finder.setGrid(_grid)
        this.Finder.setAcceptableTiles([0])
    }

    ClearPathHint(tiles = this.tiles) {
        for (let t = 0; t < tiles.length; t++) {
            var element = tiles[t]
            element.clearIndicator()
        }
    }

    Find(Tile, comfirm, tiles = this.tiles) {

        if (this.Player.state != 'idle') return
        this.ClearPathHint()
        this.Finder.findPath(this.Player.coordinateX, this.Player.coordinateY, Tile.coordinateX, Tile.coordinateY,
            function (path) {
                if (path == null) return
                const tilePath = []
                for (let p = 0; p < path.length; p++) {
                    const element = path[p]
                    const tile = tiles.find(t => t.coordinateX == element.x && t.coordinateY == element.y)
                    if (p === path.length - 1 ) {
                        if (tile.hasOwnProperty('item')) {
                            continue
                        }
                        // finally grid
                        tile.setBorderRec()
                    } else {
                        // grid on middle path
                        tile.setDot()
                    }
                    tilePath[p] = tile
                }
                comfirm(tilePath)
            })
    }
}