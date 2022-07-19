using Portfolio.Interfaces;
using Portfolio.Models.Template;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portfolio.Services
{
    public class NewsLetterTemplateService : INewsLetterTemplate
    {
        IDataProvider _data = null;

        public NewsLetterTemplateService(IDataProvider data)
        {
            _data = data;
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[NewsLetterTemplates_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            },
            returnParameters: null
            );
        }
        public Paged<NewsLetterTemplate> SelectAllPaginated(int pageIndex, int pageSize)
        {
            Paged<NewsLetterTemplate> pagedResult = null;
            List<NewsLetterTemplate> newsLetterTemplates = null;
            int totalCount = 0;
            string procName = "[dbo].[NewsLetterTemplates_SelectAll_Paginated]";
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                NewsLetterTemplate newsletterTemplates = MapSingleTemplate(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (newsLetterTemplates == null)
                {
                    newsLetterTemplates = new List<NewsLetterTemplate>();
                }
                newsLetterTemplates.Add(newsletterTemplates);
            }
            );
            if (newsLetterTemplates != null)
            {
                pagedResult = new Paged<NewsLetterTemplate>(newsLetterTemplates, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
        public void Update(NewsLetterTemplateUpdateRequest model, int userId)
        {
            string procName = "[dbo].[NewsLetterTemplates_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@CreatedBy", userId);
                AddCommonParams(model, col);
            },
            returnParameters: null

            );
        }
        public int AddNewsLetterTemplate(NewsLetterInsertRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[NewsLetterTemplates_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@CreatedBy", userId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returncol)
            {
                object fId = returncol["@Id"].Value;
                int.TryParse(fId.ToString(), out id);

            });
            return id;
        }
        public Paged<NewsLetterTemplate> SearchAllPaginated(int pageIndex, int pageSize, string query)
        {
            Paged<NewsLetterTemplate> pagedResult = null;
            List<NewsLetterTemplate> newsLetterTemplates = null;
            int totalCount = 0;
            string procName = "[dbo].[NewsLetterTemplates_Search_Paginated]";
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
                paramCol.AddWithValue("@Query", query);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                NewsLetterTemplate newsletterTemplates = MapSingleTemplate(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (newsLetterTemplates == null)
                {
                    newsLetterTemplates = new List<NewsLetterTemplate>();
                }
                newsLetterTemplates.Add(newsletterTemplates);
            }
            );
            if (newsLetterTemplates != null)
            {
                pagedResult = new Paged<NewsLetterTemplate>(newsLetterTemplates, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
        private static NewsLetterTemplate MapSingleTemplate(IDataReader reader, ref int startingIndex)
        {
            NewsLetterTemplate newsLetterTemplate = new NewsLetterTemplate();
            newsLetterTemplate.Id = reader.GetSafeInt32(startingIndex++);
            newsLetterTemplate.Name = reader.GetSafeString(startingIndex++);
            newsLetterTemplate.Description = reader.GetSafeString(startingIndex++);
            newsLetterTemplate.PrimaryImage = reader.GetSafeString(startingIndex++);
            newsLetterTemplate.DateCreated = reader.GetSafeDateTime(startingIndex++);
            newsLetterTemplate.DateModified = reader.GetSafeDateTime(startingIndex++);
            newsLetterTemplate.CreatedBy = reader.GetSafeInt32(startingIndex++);

            return newsLetterTemplate;

        }
        private static void AddCommonParams(NewsLetterInsertRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@PrimaryImage", model.PrimaryImage);

        }
    }
}
