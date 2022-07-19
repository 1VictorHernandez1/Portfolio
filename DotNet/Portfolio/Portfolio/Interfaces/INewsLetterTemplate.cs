using Portfolio.Models.Template;
using Portfolio.Requests.NewsLetterTemplates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portfolio.Interfaces
{
    public interface INewsLetterTemplate
    {
        void Delete(int id);

        Paged<NewsLetterTemplate> SelectAllPaginated(int pageIndex, int pageSize);

        void Update(NewsLetterTemplateUpdateRequest model, int userId);

        int AddNewsLetterTemplate(NewsLetterInsertRequest model, int userId);

        Paged<NewsLetterTemplate> SearchAllPaginated(int pageIndex, int pageSize, string query);
    }
}
