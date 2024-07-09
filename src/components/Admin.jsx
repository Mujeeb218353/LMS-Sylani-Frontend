const Admin = () => {
  return (
    <div className="flex justify-center">
      <div role="tablist" className="tabs tabs-bordered">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Assignments"
        />
        <div role="tabpanel" className="tab-content p-10">
          Assignments
        </div>

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Quizzes"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content p-10">
          Quizzes
        </div>

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Results"
        />
        <div role="tabpanel" className="tab-content p-10">
          Results
        </div>
      </div>
    </div>
  );
};

export default Admin;
