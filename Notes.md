# Redis
- in memory DB/store / Hashmap store 
- state loaded inside RAM(super fast)
- Not a replacement of DB 
- read query pressure reduced on DB
- hot data cache - fast response
- stores data only in string format

## comman use case :
  - OTP 
  - User Session 
  - Rate limiting
  - Job Queue / Background Jobs
  - Temp Data expiary 
  - Shared Counter 

## redis commands: 
  - TTL (time to live) - gives the time in seconds for which a key-value pair will be stored in redis
  - set - can set key value pair in redis, store single variable, can't be updated
  - get - get the key
  - del - delete the key
  - hset - store object, can be updated (in hash)
  - hgetall - get entire object
  - hdel - delete object
  - hget - single field
  - hexist - filed available or not


# workflow ( -> = request )
users -> backend -> redis( <- cache hit / cache miss -> ) -> DataBase




## other 
- some DB can store values in memory   