using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;

namespace Portfolio.Controllers
{
    [Route("api/newsletterstemplate")]
    [ApiController]
    public class NewsLetterTemplateApiController : BaseApiController
    {

        private IAuthenticationService<int> _authService = null;
        private INewsLetterTemplate _service;
        public NewsLetterTemplateApiController(INewsLetterTemplate service, ILogger<NewsLetterTemplateApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }


        [HttpDelete("{id:int}")]


        public ActionResult<SuccessResponse> Delete(int id)
        {

            int code = 200;
            BaseResponse response = null;

            try
            {

                _service.Delete(id);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {

                code = 500;
                response = new ErrorResponse(ex.Message);

            }

            return StatusCode(code, response);

        }

        [HttpGet("paginate")]

        public ActionResult<ItemResponse<Paged<NewsLetterTemplate>>> GetPaginated(int pageIndex, int pageSize)
        {

            int iCode = 200;
            BaseResponse baseResponse = null;

            try
            {
                Paged<NewsLetterTemplate> paged = _service.SelectAllPaginated(pageIndex, pageSize);
                if (paged == null)
                {
                    iCode = 404;
                    baseResponse = new ErrorResponse("Record not found");
                }
                else
                {
                    baseResponse = new ItemResponse<Paged<NewsLetterTemplate>> { Item = paged };
                }


            }
            catch (Exception e)
            {
                iCode = 500;
                base.Logger.LogError(e.ToString());
                baseResponse = new ErrorResponse($"Generic Error: ${e.Message}");

            }

            return StatusCode(iCode, baseResponse);

        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<SuccessResponse>> Update(NewsLetterTemplateUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {

                iCode = 500;
                response = new ErrorResponse(ex.Message);

            }

            return StatusCode(iCode, response);

        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> AddTemplate(NewsLetterInsertRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.AddNewsLetterTemplate(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);

            }

            catch (Exception exe)
            {

                Logger.LogError(exe.ToString());
                ErrorResponse errorResponse = new ErrorResponse(exe.Message);
                result = StatusCode(500, errorResponse);

            }

            return result;

        }


        [HttpGet("paginate/search")]

        public ActionResult<ItemResponse<Paged<NewsLetterTemplate>>> SearchPaginated(int pageIndex, int pageSize, string query)
        {

            int iCode = 200;
            BaseResponse baseResponse = null;

            try
            {
                Paged<NewsLetterTemplate> paged = _service.SearchAllPaginated(pageIndex, pageSize, query);
                if (paged == null)
                {
                    iCode = 404;
                    baseResponse = new ErrorResponse("Record not found");
                }
                else
                {
                    baseResponse = new ItemResponse<Paged<NewsLetterTemplate>> { Item = paged };
                }


            }
            catch (Exception e)
            {
                iCode = 500;
                base.Logger.LogError(e.ToString());
                baseResponse = new ErrorResponse($"Generic Error: ${e.Message}");

            }

            return StatusCode(iCode, baseResponse);

        }
    }
}
