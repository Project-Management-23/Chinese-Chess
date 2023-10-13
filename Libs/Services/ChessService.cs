using Libs.Entity;
using Libs.Repositories;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Libs.Services
{
    public class ChessService
    {
        private ApplicationDbContext dbContext;
        IRoomRepository roomRepository;
        private UserInRoomRepository userInRoomRepository;

        public ChessService(ApplicationDbContext dbContext) {
            this.dbContext = dbContext;
            this.roomRepository = new RoomRepository(dbContext);
            this.userInRoomRepository = new UserInRoomRepository(dbContext);
        }
        public void Save() { 
            this.dbContext.SaveChanges();
        }
        public void InsertRoom(Room r) {
            roomRepository.insertRoom(r);
            Save();
        }
        public List<Room> getRoomList() { 
            return roomRepository.getRoomList();
        }
        public void insertUserInRoom(UserInRoom userInRoom)
        {
            userInRoomRepository.insertUserInRoom(userInRoom);
            Save();
        }

    }
}
