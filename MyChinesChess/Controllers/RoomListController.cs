using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyChinesChess.Controllers
{
    public class RoomListController : Controller
    {
        // GET: RoomListController
        public ActionResult PlayRoomList()
        {
            return View();
        }

        // GET: RoomListController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: RoomListController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: RoomListController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: RoomListController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: RoomListController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: RoomListController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: RoomListController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
