export default function createGet({
  makeInputObj,
  findDocuments,
  makeOutputObj,
  logger
}) {
  return Object.freeze({ get })
  
  async function get({ params, dbConfig, errorMsgs }){
    logger.info(`[USE-CASE][GET] Reading from db - START!`);
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

    // const passwordUsernameHash = params.usernamePasswordHash;
    
    if (Object.values(params).length) {
      const userFactory = makeInputObj({ params });
      
      params = { 
        usernameHash: !params.username ? undefined : userFactory.usernameHash(),
        emailHash: !params.email ? undefined : userFactory.emailHash(),
        usernamePasswordHash: !params.usernamePasswordHash ? undefined : userFactory.usernamePasswordHash()
      };
      
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key])
    }
    
    // 'and' query
    console.log("params: ", params);
    const dbResults = await findDocuments({ query: params, dbConfig });

    // pass validate
    console.log("DB-Results: " + dbResults);
    // console.log(dbResults[0]);
    // if(dbResults[0].usernamePasswordHash !== passwordUsernameHash){
    //   throw new Error("Invalid pass");
    // }

    const results = dbResults.map(post => {
      const resultsObj = makeOutputObj({ params: post });
      return ({
        username: resultsObj.username(),
        email: resultsObj.email(),
        created: resultsObj.created(),
        modified: resultsObj.modified()
      })
    })

    return  results;
  }
}