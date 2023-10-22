using MyWebChess.CachesManage;
using Libs.Entity;
using Libs.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace MyWebChess.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private ChessService chessService;
        private IMemoryCache memoryCache;
        private CacheService cacheService;
        private CacheManage cacheManage;

        public RoomController(ChessService chessService, IMemoryCache memoryCache, CacheService cacheService) {
            this.chessService = chessService;
            this.memoryCache = memoryCache;
            this.cacheService = cacheService;
            this.cacheManage = new CacheManage(cacheService, memoryCache);
        }

        [HttpPost]
        [Route("insertRoom")]
        public IActionResult insertRoom(string RoomName) {
            chessService.InsertRoom(new Room() { Id = Guid.NewGuid(), Name = RoomName });
            return Ok(new { status = true, message = "" });
        }
        [HttpGet]
        [Route("getRoom")]
        public IActionResult getRoom()
        {
            List<Room> roomList =  chessService.getRoomList();
            return Ok(new { status = true, message = "", data = roomList });
        }
        [HttpPost]
        [Route("userJoinToRoom")]
        public IActionResult userJoinToRoom(string userName, Guid roomId)
        {
            UserInRoom userInRoom = new UserInRoom();
            userInRoom.Id = Guid.NewGuid();
            userInRoom.UserName = userName;
            userInRoom.RoomId = roomId;
            chessService.insertUserInRoom(userInRoom);
            if (cacheManage.UserInRoom.ContainsKey(roomId.ToString().ToLower()))
            {
                List<UserInRoom> usTemp = cacheManage.UserInRoom[roomId.ToString().ToLower()];
                usTemp.Add(userInRoom);
            }
            else {
                List<UserInRoom> usTemp = new List<UserInRoom>();
                usTemp.Add(userInRoom);
                cacheManage.UserInRoom.Add(roomId.ToString().ToLower(), usTemp);
            }
            return Ok(new { status = true, message = "" });
        }
        [HttpGet]
        [Route("getUserInRoom")]
        public IActionResult getUserInRoom(Guid roomId)
        {
            List<UserInRoom> usTemp = cacheManage.UserInRoom[roomId.ToString().ToLower()];
            return Ok(new { status = true, message = "", data = usTemp });
        }

    }
}
