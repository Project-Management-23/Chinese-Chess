using Libs.Data;
using Libs.Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Libs.Repositories
{
    public interface IUserInRoomRepository : IRepository<UserInRoom> {
        public void insertUserInRoom(UserInRoom r);
        public List<UserInRoom> getUserInRoomList();
        public List<UserInRoom> getUserInRoomList(Guid roomId);
    }
    public class UserInRoomRepository :  RepositoryBase<UserInRoom>, IUserInRoomRepository
    {
        public UserInRoomRepository(ApplicationDbContext dbContext) : base(dbContext) { 
        }
        public void insertUserInRoom(UserInRoom r) {
            _dbContext.UserInRoom.Add(r);
        }
        public List<UserInRoom> getUserInRoomList(Guid roomId)
        {
            return _dbContext.UserInRoom.Where(s=>s.RoomId == roomId).ToList();
        }
        public List<UserInRoom> getUserInRoomList()
        {
            return _dbContext.UserInRoom.ToList();
        }
    }
}
