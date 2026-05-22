# Redis
- in memory DB/store / Hashmap store 
- state loaded inside RAM(super fast)
- Not a replacement of DB 
- read query pressure reduced on DB
- hot data cache - fast response


## comman use case :
  - OTP 
  - User Session 
  - Rate limiting
  - Job Queue / Background Jobs
  - Temp Data expiary 
  - Shared Counter 

## Features: 
  - TTL (time to live)

# workflow ( -> = request )
users -> backend -> redis( <- cache hit / cache miss -> ) -> DataBase




## other 
- some DB can store values in memory   