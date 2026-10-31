// 289. Game of Life
// https://leetcode.com/problems/game-of-life/
// Time: O(m * n)  Space: O(1)

// dir
// 0, 1, 2
// 3, x, 4
// 5, 6, 7
class Solution {
public:
    void gameOfLife(vector<vector<int>>& board) {
        int m = board.size(), n = board[0].size();
        int dir[8][2] = {{-1, -1}, {-1, 0}, {-1, 1}, 
                         {0 , -1},          { 0, 1},
                         {1 , -1}, { 1, 0}, { 1, 1},
        };
        for(int i = 0 ; i < m ; ++i){
            for(int j = 0 ; j < n ; ++j){
                int live_count = 0;
                for(int d = 0 ; d < 8 ; ++d){
                    int temp_i = i+dir[d][0], temp_j = j+dir[d][1];
                    if(temp_i < 0 || temp_i >= m || temp_j < 0 || temp_j >= n || (board[temp_i][temp_j] & 1)==0) continue;
                    else ++live_count;
                }
                if(board[i][j] & 1){ // live cell
                    if(live_count == 2 || live_count == 3) board[i][j] |= 2;
                }else{ // dead cell
                    if(live_count == 3) board[i][j] |= 2;
                }

            }
        }
        for(int i = 0 ; i < m ; ++i){
            for(int j = 0 ; j < n ; ++j){
                board[i][j] >>= 1;
            }
        }
        return;
    }
};
