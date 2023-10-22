using Libs.Entity;
using Libs.Services;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;

namespace MyWebChess.CachesManage
{
    public class CacheManage
    {
        private IMemoryCache memoryCache;
        private CacheService cacheService;

        public CacheManage(CacheService cacheService, IMemoryCache memoryCache)
        {
            this.memoryCache = memoryCache;
            this.cacheService = cacheService;
        }

        public Dictionary<string, List<UserInRoom>> UserInRoom
        {
            get
            {
                Dictionary<string, List<UserInRoom>> userInRoomDic = (Dictionary<string, List<UserInRoom>>)memoryCache.Get("UserInRoom");
                if (userInRoomDic == null)
                {
                    List<UserInRoom> userInRooms = cacheService.getUserInRoomList();
                    userInRoomDic = new Dictionary<string, List<UserInRoom>>();
                    for (int i = 0; i < userInRooms.Count; i++)
                    {
                        if (!userInRoomDic.ContainsKey(userInRooms[i].RoomId.ToString().ToLower()))
                        {
                            List<UserInRoom> usTemp = new List<UserInRoom>();
                            usTemp.Add(userInRooms[i]);
                            userInRoomDic.Add(userInRooms[i].RoomId.ToString().ToLower(), usTemp);
                        }
                        else
                        {
                            List<UserInRoom> usTemp = userInRoomDic[userInRooms[i].RoomId.ToString().ToLower()];
                            usTemp.Add(userInRooms[i]);
                        }
                    }
                    memoryCache.Set("UserInRoom", userInRoomDic);

                }
                return userInRoomDic;
            }
        }

    }
}
