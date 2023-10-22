using Libs.Entity;
using Libs.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Libs.Services
{
    public class CacheService
    {
        private ApplicationDbContext dbContext;
        IRoomRepository roomRepository;
        IUserInRoomRepository userInRoomRepository;
        public CacheService(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
            this.roomRepository = new RoomRepository(dbContext);
            this.userInRoomRepository = new UserInRoomRepository(dbContext);
        }
        public List<UserInRoom> getUserInRoomList() { 
            return userInRoomRepository.getUserInRoomList();
        }
    }
    
}
