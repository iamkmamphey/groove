using Microsoft.AspNetCore.Mvc;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstrumentsController : ControllerBase
    {
        // NOTE: This is an in-memory example list. Replace with DB access in real app.
        private static readonly List<InstrumentDto> _instruments = new()
        {
            new InstrumentDto { Id = Guid.NewGuid(), Name = "Tambourine", DefaultBpm = 120, AudioUrl = "/Audio groove.mp3", PageIndex = 0 },
            new InstrumentDto { Id = Guid.NewGuid(), Name = "Gome - 1", DefaultBpm = 120, AudioUrl = "/Audio groove.mp3", PageIndex = 0 },
            new InstrumentDto { Id = Guid.NewGuid(), Name = "Claves", DefaultBpm = 120, AudioUrl = "/Audio groove.mp3", PageIndex = 0 }
        };

        [HttpGet]
        public IActionResult GetAll() 
        {
            return Ok(_instruments);
        }

        [HttpGet("{id}")]
        public IActionResult Get(Guid id)
        {
            if (id == Guid.Empty)
                return BadRequest("Invalid instrument ID.");

            var item = _instruments.FirstOrDefault(i => i.Id == id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpGet("page/{pageIndex}")]
        public IActionResult GetPage(int pageIndex)
        {
            if (pageIndex < 0)
                return BadRequest("Page index must be non-negative.");

            var items = _instruments.Where(i => i.PageIndex == pageIndex).ToList();
            return Ok(items);
        }

        [HttpPost("upload")]
        public IActionResult Upload() 
        {
            // Placeholder - implement file upload and save to blob or wwwroot/uploads
            return Ok(new { message = "Upload endpoint placeholder" });
        }
    }
}
