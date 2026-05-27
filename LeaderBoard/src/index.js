import express from 'express';
import { Redis } from 'ioredis';

const app = express();
const redis = new Redis(); // Connects to localhost:6379 by default

app.use(express.json());

/**
 * incr
 * zincrby
 * zrevrange
 * zrevrank
 */

/**
 * select, update, locking, transaction
 */

/** EndPoints
 *  POST /leaderboard/:postId/view     ->   increment view count of a post
 *  POST /leaderboard/score            ->   add points to a user score
 *  GET /leaderboard/                  ->   get top 10 leaders
 *  GET /leaderboard/:playerId/rank    ->   get rank of a user
 */

// POST /leaderboard/:postId/view -> increment view count of a post
app.post('/leaderboard/:postId/view', async (req, res) => {
    try {
        const { postId } = req.params;
        // Use incr to increment the views by 1
        const views = await redis.incr(`post:${postId}:views`);
        res.json({ postId, views });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /leaderboard/score -> add points to a user score
app.post('/leaderboard/score', async (req, res) => {
    try {
        const { playerId, score } = req.body;
        
        if (!playerId || score === undefined) {
            return res.status(400).json({ error: 'playerId and score are required in request body' });
        }

        // Use zincrby to increment a member's score in a sorted set
        const updatedScore = await redis.zincrby('leaderboard', score, playerId);
        res.json({ playerId, score: parseFloat(updatedScore) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /leaderboard/ -> get top 10 leaders
app.get('/leaderboard', async (req, res) => {
    try {
        // Use zrevrange to get the top 10 leaders (highest to lowest)
        // 'WITHSCORES' flag includes the scores in the result
        const topPlayers = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');
        
        const leaderboard = [];
        // The result is a flat array: [member1, score1, member2, score2, ...]
        for (let i = 0; i < topPlayers.length; i += 2) {
            leaderboard.push({
                rank: (i / 2) + 1,
                playerId: topPlayers[i],
                score: parseFloat(topPlayers[i + 1])
            });
        }

        res.json({ leaderboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /leaderboard/:playerId/rank -> get rank of a user
app.get('/leaderboard/:playerId/rank', async (req, res) => {
    try {
        const { playerId } = req.params;
        
        // Use zrevrank to get the rank (0-based) from highest to lowest score
        const rank = await redis.zrevrank('leaderboard', playerId);
        const score = await redis.zscore('leaderboard', playerId);

        if (rank === null) {
            return res.status(404).json({ error: 'Player not found in leaderboard' });
        }

        res.json({ 
            playerId, 
            rank: rank + 1, // Adding 1 for human-readable 1-based rank
            score: parseFloat(score) 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Demo Data Helper ---
// Endpoint to load some demo data into the leaderboard
app.post('/demo-data', async (req, res) => {
    try {
        // Clear existing leaderboard
        await redis.del('leaderboard');
        
        // Add 15 dummy players with random scores
        const pipeline = redis.pipeline();
        const demoPlayers = Array.from({ length: 15 }).map((_, i) => ({
            playerId: `user_${i + 1}`,
            score: Math.floor(Math.random() * 1000)
        }));

        for (const player of demoPlayers) {
            pipeline.zadd('leaderboard', player.score, player.playerId);
        }

        await pipeline.exec();
        res.json({ 
            message: 'Demo data successfully loaded into Redis!',
            inserted: demoPlayers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to load demo data' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Leaderboard API is running on http://localhost:${PORT}`);
    console.log('Use POST /demo-data to generate demo players!');
});