using Microsoft.AspNetCore.Mvc;
using NovaAthletique.Api.Services;

namespace NovaAthletique.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoachesController : ControllerBase
{
    private readonly ScheduleDataService _scheduleDataService;

    public CoachesController(ScheduleDataService scheduleDataService)
    {
        _scheduleDataService = scheduleDataService;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var coaches = _scheduleDataService.GetCoaches();
        return Ok(coaches);
    }
}