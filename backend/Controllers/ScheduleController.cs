using Microsoft.AspNetCore.Mvc;
using NovaAthletique.Api.Services;

namespace NovaAthletique.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScheduleController : ControllerBase
{
    private readonly ScheduleDataService _scheduleDataService;

    public ScheduleController(ScheduleDataService scheduleDataService)
    {
        _scheduleDataService = scheduleDataService;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var slots = _scheduleDataService.GetScheduleSlots();
        return Ok(slots);
    }
}